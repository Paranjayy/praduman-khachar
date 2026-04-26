#!/usr/bin/env node
/**
 * scripts/scrape-videos.mjs
 *
 * Scrapes Dr. Praduman Khachar's YouTube channel for:
 *   - Video metadata (title, description, thumbnail, publishedAt, views, likes)
 *   - Full transcripts (Hindi/Gujarati/English via YouTube's auto-captions)
 *
 * Output: src/data/videos.json  (used by Articles page)
 *
 * Usage:
 *   node scripts/scrape-videos.mjs
 *   node scripts/scrape-videos.mjs --limit 20   (only first 20 videos)
 *   node scripts/scrape-videos.mjs --playlist PLxxxxxx
 *
 * Requirements: no API key needed (uses public RSS + transcript APIs)
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { YoutubeTranscript } from "youtube-transcript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── CONFIG ──────────────────────────────────────────────────────────────────
const CHANNEL_ID = "UCPradumanKhachar"; // Will be resolved from handle
const CHANNEL_HANDLE = "PradumanKhachar";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?user=${CHANNEL_HANDLE}`;
const RSS2JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=50`;
const PLAYLIST_RSS = (id) =>
  `https://www.youtube.com/feeds/videos.xml?playlist_id=${id}`;

const args = process.argv.slice(2);
const limitArg = args.indexOf("--limit");
const LIMIT = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : 100;
const playlistArg = args.indexOf("--playlist");
const PLAYLIST = playlistArg !== -1 ? args[playlistArg + 1] : null;

const DELAY_MS = 1200; // Polite delay between transcript fetches
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── HELPERS ──────────────────────────────────────────────────────────────────
function extractVideoId(url) {
  const m = url?.match(/(?:v=|\/embed\/|\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function cleanText(str) {
  return (str || "")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function transcriptToText(segments) {
  if (!segments || !segments.length) return "";
  return segments
    .map((s) => cleanText(s.text))
    .join(" ")
    .replace(/\[.*?\]/g, "") // remove [Music], [Applause]
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadTime(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── FETCH VIDEOS FROM RSS ────────────────────────────────────────────────────
async function fetchVideosFromRSS(url) {
  console.log(`\n📡 Fetching RSS: ${url}`);
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=50`;
  const res = await fetch(apiUrl, { signal: AbortSignal.timeout(15000) });
  const data = await res.json();
  if (data.status !== "ok") throw new Error(`RSS failed: ${data.message}`);
  return data.items || [];
}

// ── FETCH EXTENDED VIDEO PAGE DATA ───────────────────────────────────────────
async function fetchVideoPageData(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();

    // Views
    const viewsMatch = html.match(/"viewCount":"(\d+)"/);
    const views = viewsMatch ? parseInt(viewsMatch[1]).toLocaleString("en-IN") : null;

    // Likes (approximate — YouTube often hides exact count)
    const likesMatch = html.match(/"label":"([\d,]+) likes"/);
    const likes = likesMatch ? likesMatch[1] : null;

    // Description (from ytInitialPlayerResponse)
    const descMatch = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
    const description = descMatch ? cleanText(JSON.parse(`"${descMatch[1]}"`)) : null;

    // Keywords/tags
    const tagsMatch = html.match(/"keywords":\[(.*?)\]/s);
    const tags = tagsMatch
      ? tagsMatch[1]
          .split(",")
          .map((t) => t.replace(/"/g, "").trim())
          .filter(Boolean)
          .slice(0, 8)
      : [];

    // Category
    const catMatch = html.match(/"category":"([^"]+)"/);
    const category = catMatch ? catMatch[1] : null;

    return { views, likes, description, tags, category };
  } catch (e) {
    console.warn(`  ⚠️  Page fetch failed for ${videoId}: ${e.message}`);
    return { views: null, likes: null, description: null, tags: [], category: null };
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🎬 Dr. Praduman Khachar — YouTube Video Scraper");
  console.log("═".repeat(55));

  let rssItems = [];

  if (PLAYLIST) {
    rssItems = await fetchVideosFromRSS(PLAYLIST_RSS(PLAYLIST));
    console.log(`✅ Playlist feed: ${rssItems.length} videos`);
  } else {
    rssItems = await fetchVideosFromRSS(RSS2JSON);
    console.log(`✅ Channel feed: ${rssItems.length} videos`);
  }

  const toProcess = rssItems.slice(0, LIMIT);
  console.log(`\n🔄 Processing ${toProcess.length} videos...\n`);

  const results = [];
  let transcriptOk = 0;
  let transcriptFail = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const item = toProcess[i];
    const videoId = extractVideoId(item.link) || extractVideoId(item.guid);

    if (!videoId) {
      console.warn(`  ⚠️  Could not extract video ID from: ${item.link}`);
      continue;
    }

    const progress = `[${String(i + 1).padStart(3)}/${toProcess.length}]`;
    const title = cleanText(item.title);
    console.log(`${progress} 📹 ${title.slice(0, 65)}...`);

    // Fetch extended page data
    const pageData = await fetchVideoPageData(videoId);
    await sleep(400);

    // Fetch transcript
    let transcript = "";
    let transcriptLang = null;
    try {
      // Try English first, then Hindi, then Gujarati, then auto-generated
      const langs = ["en", "hi", "gu", "en-IN"];
      let segs = null;
      for (const lang of langs) {
        try {
          segs = await YoutubeTranscript.fetchTranscript(videoId, { lang });
          transcriptLang = lang;
          break;
        } catch {
          continue;
        }
      }
      if (!segs) {
        // Fallback: no lang preference
        segs = await YoutubeTranscript.fetchTranscript(videoId);
        transcriptLang = "auto";
      }
      transcript = transcriptToText(segs);
      transcriptOk++;
      console.log(
        `         ✅ Transcript (${transcriptLang}): ${transcript.split(" ").length} words`
      );
    } catch (e) {
      transcriptFail++;
      console.log(`         ❌ Transcript unavailable: ${e.message?.slice(0, 60)}`);
    }

    const description = pageData.description || cleanText(item.description || item.content || "");

    results.push({
      id: videoId,
      slug: slugify(title),
      title,
      description: description.slice(0, 800), // truncate for JSON size
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailMq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      publishedAt: item.pubDate || item.published,
      views: pageData.views,
      likes: pageData.likes,
      tags: pageData.tags,
      category: pageData.category,
      transcriptLang,
      transcriptWordCount: transcript ? transcript.split(" ").filter(Boolean).length : 0,
      readMinutes: estimateReadTime(transcript || description),
      transcript: transcript.slice(0, 15000), // ~3000-word cap per video
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });

    await sleep(DELAY_MS);
  }

  // ── WRITE OUTPUT ───────────────────────────────────────────────────────────
  const outDir = join(ROOT, "public", "data");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "videos.json");

  const output = {
    scraped_at: new Date().toISOString(),
    total: results.length,
    transcript_ok: transcriptOk,
    transcript_fail: transcriptFail,
    videos: results,
  };

  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");

  console.log("\n" + "═".repeat(55));
  console.log(`✅ Done! ${results.length} videos saved to public/data/videos.json`);
  console.log(`   Transcripts: ${transcriptOk} OK / ${transcriptFail} failed`);
  console.log(`   File: ${outPath}`);
  console.log("\nNext steps:");
  console.log("  • Run again with --limit 20 to test on a small batch");
  console.log("  • Run with --playlist PLxxxxxx for a specific playlist");
  console.log("  • The Articles page at /articles will auto-load this data\n");
}

main().catch((e) => {
  console.error("❌ Fatal:", e);
  process.exit(1);
});
