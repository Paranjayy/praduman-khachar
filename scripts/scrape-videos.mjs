#!/usr/bin/env node
/**
 * scripts/scrape-videos.mjs
 *
 * Scrapes Dr. Praduman Khachar's YouTube channel for:
 *   - Video metadata (title, description, thumbnail, publishedAt, views, likes)
 *   - Full transcripts (Hindi/Gujarati/English via YouTube's captions)
 *
 * Output: public/data/videos.json  (fetched at runtime by /articles page)
 *
 * Usage:
 *   node scripts/scrape-videos.mjs                  # full channel
 *   node scripts/scrape-videos.mjs --limit 5        # test with 5 videos
 *   node scripts/scrape-videos.mjs --playlist PLxx  # specific playlist
 *
 * No API key required — uses public YouTube RSS feeds.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { YoutubeTranscript } from "youtube-transcript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── CONFIG ───────────────────────────────────────────────────────────────────
// The channel ID — find it by going to the YouTube channel > View Page Source
// and searching for "channelId". For @PradumanKhachar this is typically below.
const CHANNEL_ID = "UCcxFZ3XuZjB9eXyFZdrjDXQ"; // Update if wrong!
const CHANNEL_HANDLE = "PradumanKhachar";

const args = process.argv.slice(2);
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 100;
const plIdx = args.indexOf("--playlist");
const PLAYLIST = plIdx !== -1 ? args[plIdx + 1] : null;

const DELAY_MS = 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── HELPERS ──────────────────────────────────────────────────────────────────
function extractVideoId(url) {
  const m = (url || "").match(
    /(?:v=|\/embed\/|\/shorts\/|youtu\.be\/|\/watch\?v=)([A-Za-z0-9_-]{11})/
  );
  if (m) return m[1];
  // RSS uses yt:videoId tag content
  const yt = (url || "").match(/^([A-Za-z0-9_-]{11})$/);
  return yt ? yt[1] : null;
}

function cleanText(str) {
  return (str || "")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, " ")
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

function transcriptToText(segs) {
  if (!segs?.length) return "";
  return segs
    .map((s) => cleanText(s.text))
    .join(" ")
    .replace(/\[.*?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateRead(text) {
  return Math.max(1, Math.ceil((text || "").split(/\s+/).length / 200));
}

// ── FETCH RSS XML ─────────────────────────────────────────────────────────────
async function fetchRSSXML(url) {
  console.log(`\n📡 Fetching: ${url}`);
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// Parse YouTube RSS XML manually (no DOM required in Node)
function parseRSSItems(xml) {
  const items = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRegex.exec(xml)) !== null) {
    const entry = m[1];
    const get = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`);
      const res = r.exec(entry);
      return res ? cleanText(res[1]) : "";
    };
    const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!videoId) continue;

    const viewsMatch = entry.match(/<media:statistics views="(\d+)"/);
    const thumbMatch = entry.match(/url="(https:\/\/i[^"]+)"/);

    items.push({
      videoId,
      title: get("title"),
      published: get("published"),
      description: get("media:description") || get("description"),
      views: viewsMatch ? parseInt(viewsMatch[1]).toLocaleString("en-IN") : null,
      thumbnail: thumbMatch ? thumbMatch[1] : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    });
  }
  return items;
}

// ── FETCH VIDEO PAGE ──────────────────────────────────────────────────────────
async function fetchVideoPage(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();

    const likesMatch = html.match(/"label":"([\d,]+) likes"/);
    const descMatch = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
    const tagsMatch = html.match(/"keywords":\[(.*?)\]/s);

    return {
      likes: likesMatch ? likesMatch[1] : null,
      description: descMatch ? cleanText(JSON.parse(`"${descMatch[1]}"`)) : null,
      tags: tagsMatch
        ? tagsMatch[1].split(",").map((t) => t.replace(/"/g, "").trim()).filter(Boolean).slice(0, 8)
        : [],
    };
  } catch {
    return { likes: null, description: null, tags: [] };
  }
}

// ── CHANNEL ID RESOLVER ───────────────────────────────────────────────────────
async function resolveChannelId(handle) {
  try {
    const res = await fetch(`https://www.youtube.com/@${handle}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();
    const m = html.match(/"channelId":"([^"]+)"/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🎬 Dr. Praduman Khachar — YouTube Scraper");
  console.log("═".repeat(50));

  let rssUrl;
  if (PLAYLIST) {
    rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST}`;
  } else {
    // Try configured ID first
    let channelId = CHANNEL_ID;
    if (!channelId) {
      console.log(`🔍 Resolving channel ID for @${CHANNEL_HANDLE}...`);
      channelId = await resolveChannelId(CHANNEL_HANDLE);
      if (!channelId) throw new Error("Could not resolve channel ID. Set CHANNEL_ID in script.");
      console.log(`✅ Channel ID: ${channelId}`);
    }
    rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  }

  const xml = await fetchRSSXML(rssUrl);
  const allItems = parseRSSItems(xml);
  console.log(`✅ Found ${allItems.length} videos in feed`);

  const toProcess = allItems.slice(0, LIMIT);
  console.log(`\n🔄 Processing ${toProcess.length} videos (limit: ${LIMIT})\n`);

  const results = [];
  let transcriptOk = 0, transcriptFail = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const item = toProcess[i];
    const { videoId } = item;
    const progress = `[${String(i + 1).padStart(3)}/${toProcess.length}]`;
    const title = cleanText(item.title);
    console.log(`${progress} ${title.slice(0, 60)}…`);

    // Extended page data
    const page = await fetchVideoPage(videoId);
    await sleep(400);

    // Transcript
    let transcript = "", transcriptLang = null;
    try {
      const langs = ["en", "hi", "gu", "en-IN"];
      let segs = null;
      for (const lang of langs) {
        try { segs = await YoutubeTranscript.fetchTranscript(videoId, { lang }); transcriptLang = lang; break; }
        catch { continue; }
      }
      if (!segs) { segs = await YoutubeTranscript.fetchTranscript(videoId); transcriptLang = "auto"; }
      transcript = transcriptToText(segs);
      transcriptOk++;
      console.log(`         ✅ ${transcriptLang} — ${transcript.split(" ").length} words`);
    } catch (e) {
      transcriptFail++;
      console.log(`         ❌ ${e.message?.slice(0, 55)}`);
    }

    const desc = page.description || item.description || "";
    results.push({
      id: videoId,
      slug: slugify(title),
      title,
      description: desc.slice(0, 800),
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailMq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      publishedAt: item.published,
      views: item.views,
      likes: page.likes,
      tags: page.tags,
      transcriptLang,
      transcriptWordCount: transcript ? transcript.split(" ").filter(Boolean).length : 0,
      readMinutes: estimateRead(transcript || desc),
      transcript: transcript.slice(0, 15000),
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });

    await sleep(DELAY_MS);
  }

  const outDir = join(ROOT, "public", "data");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "videos.json");

  writeFileSync(outPath, JSON.stringify({
    scraped_at: new Date().toISOString(),
    total: results.length,
    transcript_ok: transcriptOk,
    transcript_fail: transcriptFail,
    videos: results,
  }, null, 2), "utf8");

  console.log("\n" + "═".repeat(50));
  console.log(`✅ ${results.length} videos → public/data/videos.json`);
  console.log(`   Transcripts: ${transcriptOk} OK / ${transcriptFail} failed`);
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
