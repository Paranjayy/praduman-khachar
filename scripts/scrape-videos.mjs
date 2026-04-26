#!/usr/bin/env node
/**
 * scripts/scrape-videos.mjs  (v2 — playlist-chained, resume-capable)
 *
 * Strategy:
 *   1. Scrape all playlist RSS feeds → collect unique video IDs (bypasses the
 *      15-video channel RSS cap — with 33 playlists we can find 200-400+ videos)
 *   2. Optionally load existing videos.json to SKIP already-scraped videos
 *   3. For each new video: fetch page (likes, description, tags) + transcript
 *
 * Usage:
 *   node scripts/scrape-videos.mjs                     # all playlists, resume from existing
 *   node scripts/scrape-videos.mjs --fresh             # ignore existing, rescrape all
 *   node scripts/scrape-videos.mjs --limit 30          # cap at N new videos
 *   node scripts/scrape-videos.mjs --playlist PLxxx    # one playlist only
 *
 * Output: public/data/videos.json
 * No API key required.
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { YoutubeTranscript } from "youtube-transcript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_PATH = join(ROOT, "public", "data", "videos.json");
const PLAYLISTS_PATH = join(ROOT, "public", "data", "playlists.json");

// ── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const FRESH = args.includes("--fresh");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const plIdx = args.indexOf("--playlist");
const SINGLE_PLAYLIST = plIdx !== -1 ? args[plIdx + 1] : null;

// Polite delay between requests
const DELAY_MS = 900;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Channel fallback (RSS only gives 15) ─────────────────────────────────────
const CHANNEL_ID = "UCcxFZ3XuZjB9eXyFZdrjDXQ";

// ── Helpers ───────────────────────────────────────────────────────────────────
function cleanText(str) {
  return (str || "")
    .replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ").trim();
}

function slugify(str) {
  return str.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

function transcriptToText(segs) {
  if (!segs?.length) return "";
  return segs.map(s => cleanText(s.text)).join(" ").replace(/\[.*?\]/g, "").replace(/\s+/g, " ").trim();
}

function estimateRead(text) {
  return Math.max(1, Math.ceil((text || "").split(/\s+/).length / 200));
}

// ── Parse RSS XML ─────────────────────────────────────────────────────────────
function parseRSSEntries(xml) {
  const items = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRegex.exec(xml)) !== null) {
    const entry = m[1];
    const get = tag => { const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`); const res = r.exec(entry); return res ? cleanText(res[1]) : ""; };
    const vidMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    if (!vidMatch) continue;
    const videoId = vidMatch[1];
    const viewsMatch = entry.match(/<media:statistics views="(\d+)"/);
    items.push({
      videoId,
      title: get("title"),
      published: get("published"),
      description: get("media:description") || get("description"),
      views: viewsMatch ? parseInt(viewsMatch[1]).toLocaleString("en-IN") : null,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    });
  }
  return items;
}

async function fetchRSS(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ── Discover all video IDs from playlists ─────────────────────────────────────
async function discoverVideoIds() {
  // Load playlist IDs from already-scraped playlists.json, or fallback list
  let playlistIds = [];
  if (existsSync(PLAYLISTS_PATH)) {
    const data = JSON.parse(readFileSync(PLAYLISTS_PATH, "utf8"));
    playlistIds = data.playlists.map(p => p.id);
    console.log(`📋 Loaded ${playlistIds.length} playlists from playlists.json`);
  } else {
    // Fallback: just use the channel feed
    console.log(`⚠️  No playlists.json found — using channel feed only (15 videos)`);
    return null;
  }

  const seen = new Map(); // videoId → entry data
  let playlistsDone = 0;

  for (const pid of playlistIds) {
    try {
      const xml = await fetchRSS(`https://www.youtube.com/feeds/videos.xml?playlist_id=${pid}`);
      const entries = parseRSSEntries(xml);
      for (const e of entries) {
        if (!seen.has(e.videoId)) seen.set(e.videoId, e);
      }
      playlistsDone++;
      process.stdout.write(`\r  🎬 Playlists scanned: ${playlistsDone}/${playlistIds.length} | Unique videos: ${seen.size}   `);
      await sleep(300);
    } catch {
      // silently skip failed playlists
    }
  }
  console.log(); // newline
  return [...seen.values()];
}

// ── Fetch video page (likes, description, tags) ───────────────────────────────
async function fetchVideoPage(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();
    // Likes: YouTube embeds like count in accessible label
    const likesMatch = html.match(/"label":"([\d,]+) likes"/) ||
                       html.match(/(\d[\d,]*) likes/) ||
                       html.match(/"likeCount":"(\d+)"/);
    const descMatch = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
    const tagsMatch = html.match(/"keywords":\[(.*?)\]/s);
    const commentsMatch = html.match(/"commentCount":"(\d+)"/);
    return {
      likes: likesMatch ? likesMatch[1].replace(/,/g, "") : null,
      comments: commentsMatch ? parseInt(commentsMatch[1]).toLocaleString("en-IN") : null,
      description: descMatch ? (() => { try { return cleanText(JSON.parse(`"${descMatch[1]}"`)); } catch { return null; } })() : null,
      tags: tagsMatch ? tagsMatch[1].split(",").map(t => t.replace(/"/g, "").trim()).filter(Boolean).slice(0, 8) : [],
    };
  } catch {
    return { likes: null, comments: null, description: null, tags: [] };
  }
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🎬 Dr. Praduman Khachar — YouTube Scraper v2 (Playlist-Chained)");
  console.log("═".repeat(60));

  // ── Load existing data for resume ──────────────────────────────────────────
  let existing = new Map();
  if (!FRESH && existsSync(OUT_PATH)) {
    const old = JSON.parse(readFileSync(OUT_PATH, "utf8"));
    (old.videos || []).forEach(v => existing.set(v.id, v));
    console.log(`♻️  Resume mode: ${existing.size} videos already scraped (--fresh to ignore)`);
  } else {
    console.log(`🆕  Fresh mode — scraping everything`);
  }

  // ── Discover video IDs ─────────────────────────────────────────────────────
  let allEntries;
  if (SINGLE_PLAYLIST) {
    console.log(`\n📋 Single playlist mode: ${SINGLE_PLAYLIST}`);
    const xml = await fetchRSS(`https://www.youtube.com/feeds/videos.xml?playlist_id=${SINGLE_PLAYLIST}`);
    allEntries = parseRSSEntries(xml);
  } else {
    console.log(`\n🔍 Discovering videos from all playlists...`);
    allEntries = await discoverVideoIds();
    if (!allEntries) {
      // fallback to channel feed
      const xml = await fetchRSS(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
      allEntries = parseRSSEntries(xml);
    }
  }

  console.log(`✅ Discovered ${allEntries.length} unique videos`);

  // ── Filter already-scraped ─────────────────────────────────────────────────
  const toProcess = allEntries.filter(e => !existing.has(e.videoId)).slice(0, LIMIT);
  const skipped = allEntries.length - toProcess.length;
  if (skipped > 0) console.log(`⏭️  Skipping ${skipped} already-scraped videos`);
  console.log(`\n🔄 Processing ${toProcess.length} NEW videos...\n`);

  const newResults = [];
  let transcriptOk = 0, transcriptFail = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const item = toProcess[i];
    const { videoId } = item;
    const progress = `[${String(i + 1).padStart(3)}/${toProcess.length}]`;
    const title = cleanText(item.title);
    console.log(`${progress} ${title.slice(0, 55)}…`);

    // Page data (likes, comments, tags)
    const page = await fetchVideoPage(videoId);
    await sleep(400);

    // Transcript
    let transcript = "", transcriptLang = null;
    try {
      const langs = ["gu", "hi", "en", "en-IN"];
      let segs = null;
      for (const lang of langs) {
        try { segs = await YoutubeTranscript.fetchTranscript(videoId, { lang }); transcriptLang = lang; break; }
        catch { continue; }
      }
      if (!segs) { segs = await YoutubeTranscript.fetchTranscript(videoId); transcriptLang = "auto"; }
      transcript = transcriptToText(segs);
      transcriptOk++;
      console.log(`        ✅ ${transcriptLang} — ${transcript.split(" ").length} words${page.likes ? ` | 👍 ${page.likes}` : ""}${page.comments ? ` | 💬 ${page.comments}` : ""}`);
    } catch (e) {
      transcriptFail++;
      console.log(`        ❌ no transcript — ${e.message?.slice(0, 40)}`);
    }

    const desc = page.description || item.description || "";
    newResults.push({
      id: videoId,
      slug: slugify(title),
      title,
      description: desc.slice(0, 800),
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailMq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      publishedAt: item.published,
      views: item.views,
      likes: page.likes,
      comments: page.comments,
      tags: page.tags,
      transcriptLang,
      transcriptWordCount: transcript ? transcript.split(" ").filter(Boolean).length : 0,
      readMinutes: estimateRead(transcript || desc),
      transcript: transcript.slice(0, 15000),
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });

    await sleep(DELAY_MS);
  }

  // ── Merge with existing and save ──────────────────────────────────────────
  const merged = [...existing.values(), ...newResults];
  // Sort by published date (newest first)
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

  console.log("\n" + "═".repeat(60));
  console.log(`✅ ${merged.length} total videos → public/data/videos.json`);
  console.log(`   New: ${newResults.length} | Existing: ${existing.size} | Transcripts: ${transcriptOk}✅ ${transcriptFail}❌`);
  if (toProcess.length < allEntries.length - skipped) {
    console.log(`\n💡 Run again to continue (already-scraped videos are skipped automatically)`);
  }
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
