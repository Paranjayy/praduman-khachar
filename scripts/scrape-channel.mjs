#!/usr/bin/env node
/**
 * scripts/scrape-channel.mjs  (yt-dlp powered — FULL CHANNEL)
 *
 * Strategy:
 *   Phase 1: yt-dlp --flat-playlist → enumerate ALL 575+ video IDs from channel
 *   Phase 2: For each video, use yt-dlp to get metadata + auto-subtitles as text
 *   Phase 3: Merge with RSS data for real-time view counts
 *   Resume:  Skips videos already in videos.json unless --fresh
 *
 * Why yt-dlp over RSS:
 *   - RSS is capped at 15 videos per channel/playlist
 *   - yt-dlp enumerates the ENTIRE channel (575+ videos)
 *   - yt-dlp fetches auto-generated subtitles even when captions are disabled
 *   - No API key required
 *
 * Usage:
 *   node scripts/scrape-channel.mjs                  # full channel, resume mode
 *   node scripts/scrape-channel.mjs --fresh          # rescrape everything
 *   node scripts/scrape-channel.mjs --limit 50       # cap at 50 new videos
 *   node scripts/scrape-channel.mjs --batch 20       # process in batches of 20
 *
 * Output: public/data/videos.json
 * Requires: yt-dlp installed (brew install yt-dlp)
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync, spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_PATH = join(ROOT, "public", "data", "videos.json");
const TMP_DIR = join(ROOT, ".tmp-subs");

const CHANNEL_URL = "https://www.youtube.com/@PradumanKhachar";
const CHANNEL_ID = "UCcxFZ3XuZjB9eXyFZdrjDXQ";

// ── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const FRESH = args.includes("--fresh");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const batchIdx = args.indexOf("--batch");
const BATCH = batchIdx !== -1 ? parseInt(args[batchIdx + 1], 10) : 30;

const DELAY_MS = 600;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Helpers ───────────────────────────────────────────────────────────────────
function cleanText(str) {
  return (str || "")
    .replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(str) {
  return (str || "").toLowerCase()
    .replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

function estimateRead(text) {
  return Math.max(1, Math.ceil((text || "").split(/\s+/).length / 200));
}

/** Parse VTT subtitle file into plain text */
function parseVTT(content) {
  return content
    .replace(/WEBVTT.*?\n\n/s, "")          // header
    .replace(/^\d{2}:\d{2}:\d{2}\.\d{3} --> .+$/gm, "") // timestamps
    .replace(/^\d+$/gm, "")                  // sequence numbers
    .replace(/<[^>]+>/g, " ")                // HTML tags
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    // Remove duplicate consecutive lines (VTT often repeats)
    .filter((line, i, arr) => i === 0 || line !== arr[i - 1])
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Parse VTT into timestamped segments: [{t: seconds, text: string}]
 * VTT format: HH:MM:SS.mmm --> HH:MM:SS.mmm\ntext\n\n
 */
function parseVTTWithTimestamps(content) {
  const segments = [];
  // Match cues: optional id, timestamp line, text
  const cueRe = /(?:^[\d]+\n)?(\d{2}:\d{2}:\d{2}[.,]\d{3}) --> (?:\d{2}:\d{2}:\d{2}[.,]\d{3})[^\n]*\n([\s\S]*?)(?=\n(?:[\d]+\n)?\d{2}:\d{2}:\d{2}|$)/gm;
  let match;
  let lastT = -1;
  while ((match = cueRe.exec(content)) !== null) {
    const [h, m, s] = match[1].split(':').map(Number);
    const t = h * 3600 + m * 60 + s;
    const text = match[2]
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/\n/g, ' ').trim();
    if (!text) continue;
    // Skip duplicate consecutive timestamps (VTT overlap)
    if (t === lastT) { if (segments.length) segments[segments.length-1].text += ' ' + text; continue; }
    lastT = t;
    segments.push({ t, text });
  }
  return segments;
}


/** Run yt-dlp synchronously with timeout, return stdout */
function ytdlp(argsList, opts = {}) {
  try {
    const result = execSync(
      `yt-dlp ${argsList.map(a => `"${a}"`).join(" ")}`,
      {
        maxBuffer: 50 * 1024 * 1024,
        timeout: opts.timeout || 60000,
        stdio: ["ignore", "pipe", "pipe"],
      }
    );
    return result.toString("utf8");
  } catch (e) {
    if (opts.throwOnError) throw e;
    return null;
  }
}

// ── Phase 1: Enumerate all video IDs ──────────────────────────────────────────────
async function getAllVideoIds() {
  console.log("🔍 Phase 1: Enumerating ALL channel content (videos, shorts, streams)...");

  const urlsToScrape = [
    `${CHANNEL_URL}/videos`,
    `${CHANNEL_URL}/shorts`,
    `${CHANNEL_URL}/streams`,
  ];

  const allParsed = [];

  for (const url of urlsToScrape) {
    console.log(`   Trying: ${url}`);
    const raw = ytdlp([
      "--flat-playlist",
      "--print", "%(id)s\t%(title)s\t%(upload_date)s\t%(view_count)s\t%(duration)s",
      "--no-warnings",
      "--quiet",
      url,
    ], { timeout: 300000 }); // 5 min

    if (raw && raw.trim()) {
      const parsed = parseVideoList(raw);
      if (parsed.length > 0) {
        console.log(`   ✅ Found ${parsed.length} items via ${url}`);
        allParsed.push(...parsed);
      } else {
        console.log(`   ⚠️  No items found at ${url}`);
      }
    } else {
      console.log(`   ⚠️  No items found at ${url}`);
    }
  }

  // Deduplicate by ID
  const uniqueMap = new Map();
  for (const item of allParsed) {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  }

  const uniqueList = Array.from(uniqueMap.values());
  if (uniqueList.length === 0) {
    throw new Error("Could not enumerate channel from any URL. Check network/yt-dlp.");
  }

  return uniqueList;
}

function parseVideoList(raw) {
  return raw.trim().split("\n")
    .filter(Boolean)
    .map(line => {
      const [id, title, uploadDate, views, duration] = line.split("\t");
      return {
        id: id?.trim(),
        title: cleanText(title),
        // uploadDate: "20240821" → ISO, handle "NA" from yt-dlp
        publishedAt: (uploadDate && uploadDate !== "NA") ? `${uploadDate.slice(0,4)}-${uploadDate.slice(4,6)}-${uploadDate.slice(6,8)}T00:00:00Z` : null,
        views: views ? parseInt(views).toLocaleString("en-IN") : null,
        durationSec: duration ? parseInt(duration) : null,
      };
    })
    .filter(v => v.id && v.id.length === 11);
}

// ── Phase 2: Get subtitles + metadata for one video ───────────────────────────
async function scrapeVideo(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  // ── Get JSON metadata (description, tags, like_count, comment_count) ──────
  let meta = {};
  try {
    const jsonOut = ytdlp([
      "--dump-single-json",
      "--no-playlist",
      "--no-warnings",
      "--quiet",
      url,
    ], { timeout: 30000 });
    if (jsonOut) {
      const parsed = JSON.parse(jsonOut);
      meta = {
        description: cleanText(parsed.description || "").slice(0, 800),
        tags: (parsed.tags || []).slice(0, 10),
        likes: parsed.like_count ? parsed.like_count.toLocaleString("en-IN") : null,
        comments: parsed.comment_count ? parsed.comment_count.toLocaleString("en-IN") : null,
        views: parsed.view_count ? parsed.view_count.toLocaleString("en-IN") : null,
        channel: parsed.uploader,
        categories: parsed.categories || [],
        thumbnail: parsed.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        thumbnailMq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      };
    }
  } catch (_) {}

  // ── Get subtitles ──────────────────────────────────────────────────────────
  let transcript = "";
  let transcriptLang = null;

  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });
  const subBase = join(TMP_DIR, videoId);

  // Try manual subs first (gu, hi, en), then auto-subs
  const subArgs = [
    "--write-subs",
    "--write-auto-subs",
    "--sub-langs", "gu,hi,en,hi-IN,gu-IN",
    "--sub-format", "vtt",
    "--convert-subs", "vtt",
    "--skip-download",
    "--no-playlist",
    "--no-warnings",
    "--quiet",
    "-o", subBase,
    url,
  ];

  try {
    ytdlp(subArgs, { timeout: 45000 });
  } catch (_) {}

  // Find which subtitle file was created
  const subFiles = existsSync(TMP_DIR)
    ? readdirSync(TMP_DIR).filter(f => f.startsWith(videoId) && f.endsWith(".vtt"))
    : [];

  // Priority: gu > hi > en > anything
  const langPriority = ["gu", "hi", "en"];
  let chosenFile = null;
  for (const lang of langPriority) {
    const f = subFiles.find(f => f.includes(`.${lang}.`) || f.includes(`-${lang}.`));
    if (f) { chosenFile = f; transcriptLang = lang; break; }
  }
  if (!chosenFile && subFiles.length > 0) {
    chosenFile = subFiles[0];
    // Extract lang from filename like "videoId.hi.vtt" or "videoId.hi-IN.vtt"
    const m = chosenFile.match(/\.([a-z]{2}(?:-[A-Z]{2})?)\.vtt$/);
    transcriptLang = m ? m[1] : "auto";
  }

  if (chosenFile) {
    try {
      const raw = readFileSync(join(TMP_DIR, chosenFile), "utf8");
      transcript = parseVTT(raw);
      // Parse with timestamps for the reader
      const segments = parseVTTWithTimestamps(raw);
      // Store segments in meta (deduplicated, max 500 segments to keep JSON lean)
      meta.transcriptSegments = segments
        .filter((s, i, arr) => i === 0 || s.text !== arr[i-1].text)
        .slice(0, 500);
      // Clean up temp files
      subFiles.forEach(f => { try { unlinkSync(join(TMP_DIR, f)); } catch (_) {} });
    } catch (_) {}
  }

  return { ...meta, transcript: transcript.slice(0, 20000), transcriptLang };
}

// ── Phase 3: RSS fallback for view counts ─────────────────────────────────────
async function fetchRSSViews(channelId) {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return new Map();
    const xml = await res.text();
    const views = new Map();
    const re = /<yt:videoId>([^<]+)<\/yt:videoId>[\s\S]*?<media:statistics views="(\d+)"/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      views.set(m[1], parseInt(m[2]).toLocaleString("en-IN"));
    }
    return views;
  } catch {
    return new Map();
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🎬 Dr. Praduman Khachar — Full Channel Scraper (yt-dlp)");
  console.log("═".repeat(62));

  // Check yt-dlp
  try { execSync("yt-dlp --version", { stdio: "ignore" }); }
  catch { console.error("❌ yt-dlp not found. Install: brew install yt-dlp"); process.exit(1); }

  // Load existing for resume
  let existing = new Map();
  if (!FRESH && existsSync(OUT_PATH)) {
    const old = JSON.parse(readFileSync(OUT_PATH, "utf8"));
    (old.videos || []).forEach(v => existing.set(v.id, v));
    console.log(`♻️  Resume: ${existing.size} videos already scraped (--fresh to ignore)`);
  } else {
    console.log("🆕  Fresh mode — scraping all videos");
  }

  // Phase 1: Enumerate
  const allVideos = await getAllVideoIds();
  console.log(`\n✅ Found ${allVideos.length} total videos on channel`);

  // Filter new
  const toProcess = allVideos.filter(v => !existing.has(v.id)).slice(0, LIMIT);
  const skipped = allVideos.length - toProcess.length;
  if (skipped) console.log(`⏭️  Skipping ${skipped} already-scraped videos`);
  console.log(`\n🔄 Processing ${toProcess.length} new videos (batch size: ${BATCH})\n`);

  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

  const newResults = [];
  let transcriptOk = 0, transcriptFail = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const v = toProcess[i];
    const progress = `[${String(i + 1).padStart(3)}/${toProcess.length}]`;
    process.stdout.write(`${progress} ${(v.title || v.id).slice(0, 55)}\n`);

    const scraped = await scrapeVideo(v.id);
    await sleep(DELAY_MS);

    const hasTranscript = scraped.transcript && scraped.transcript.length > 20;
    if (hasTranscript) {
      transcriptOk++;
      const words = scraped.transcript.split(/\s+/).filter(Boolean).length;
      process.stdout.write(`        ✅ ${scraped.transcriptLang} — ${words} words${scraped.likes ? ` | 👍 ${scraped.likes}` : ""}${scraped.comments ? ` | 💬 ${scraped.comments}` : ""}\n`);
    } else {
      transcriptFail++;
      process.stdout.write(`        ⚠️  no transcript${scraped.likes ? ` | 👍 ${scraped.likes}` : ""}\n`);
    }

    const desc = scraped.description || "";
    newResults.push({
      id: v.id,
      slug: slugify(v.title),
      title: v.title,
      description: desc.slice(0, 800),
      thumbnail: scraped.thumbnail || `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`,
      thumbnailMq: scraped.thumbnailMq || `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`,
      publishedAt: v.publishedAt,
      views: scraped.views || v.views,
      likes: scraped.likes,
      comments: scraped.comments,
      tags: scraped.tags || [],
      transcriptLang: scraped.transcriptLang,
      transcriptWordCount: hasTranscript ? scraped.transcript.split(/\s+/).filter(Boolean).length : 0,
      readMinutes: estimateRead(hasTranscript ? scraped.transcript : desc),
      transcript: hasTranscript ? scraped.transcript.slice(0, 20000) : "",
      url: `https://www.youtube.com/watch?v=${v.id}`,
    });

    // Save incrementally every BATCH videos (so resume works mid-run)
    if ((i + 1) % BATCH === 0 || i === toProcess.length - 1) {
      const merged = [...existing.values(), ...newResults];
      merged.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
      const outDir = join(ROOT, "public", "data");
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
      writeFileSync(OUT_PATH, JSON.stringify({
        scraped_at: new Date().toISOString(),
        total: merged.length,
        transcript_ok: transcriptOk,
        transcript_fail: transcriptFail,
        videos: merged,
      }, null, 2), "utf8");
      console.log(`\n💾 Saved ${merged.length} videos to public/data/videos.json\n`);
    }
  }

  // Cleanup tmp
  try {
    const remaining = readdirSync(TMP_DIR).filter(f => f.endsWith(".vtt"));
    remaining.forEach(f => { try { unlinkSync(join(TMP_DIR, f)); } catch (_) {} });
  } catch (_) {}

  const finalMerged = [...existing.values(), ...newResults];
  console.log("═".repeat(62));
  console.log(`\n✅ DONE — ${finalMerged.length} total videos in videos.json`);
  console.log(`   New: ${newResults.length} | Transcripts: ${transcriptOk}✅ ${transcriptFail}⚠️`);
  if (toProcess.length === 0 && existing.size > 0) {
    console.log(`\n✨ All videos already up to date! (use --fresh to re-scrape)`);
  }
}

main().catch(e => { console.error("❌ Fatal:", e.message); process.exit(1); });
