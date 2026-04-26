#!/usr/bin/env node
/**
 * scripts/scrape-playlists.mjs
 *
 * Scrapes all 31 public playlists from Dr. Praduman Khachar's YouTube channel.
 * Uses the YouTube RSS XML feed (no API key needed) to get:
 *  - Playlist title (from <title> in the feed)
 *  - Thumbnail (first video's hqdefault)
 *  - Video count (entries in the feed, up to 15 shown in RSS)
 *  - First video ID
 *
 * Output: public/data/playlists.json
 *
 * Usage:
 *   node scripts/scrape-playlists.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const DELAY_MS = 800;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── All playlist IDs from the console scrape ──────────────────────────────────
const PLAYLIST_IDS = [
  "PL2zfweuJuIu0x1RtnM5N5EfUadcfWRAQ3",
  "PL2zfweuJuIu2fnFRn30JJ7XmkKFMBCtj2",
  "PL2zfweuJuIu1fbBFxKgDhnwAKpeO7OZ1A",
  "PL2zfweuJuIu14NyvXE5vQ5NJ4NhxOTqXC",
  "PL2zfweuJuIu3qaCi6zk_zEXAuwDpQFJER",
  "PL2zfweuJuIu1o_eD5VG56dOTKv_l5e85t",
  "PL2zfweuJuIu0Kuv8OvkTIcNcz2ILvVsyR",
  "PL2zfweuJuIu0IvvjC2zVDJd5sVeTratv3",
  "PL2zfweuJuIu3x70DG6awITil0QwgKsuZB",
  "PL2zfweuJuIu0M6jpkjV2tTXodrflWLUdZ",
  "PL2zfweuJuIu0xgEs27j-BEj1AremxfcRu",
  "PL2zfweuJuIu2HBIEUtC8U7orOz_YVP1S7",
  "PL2zfweuJuIu3inrxPGg3HMux6Pdtf71gv",
  "PL2zfweuJuIu1sG0ej1QAwLDsloHzVWobe",
  "PL2zfweuJuIu2iN-NB2sCCWDxFiuyoUQMR",
  "PL2zfweuJuIu1KkVsHeCILHSOHH8wVLYLv",
  "PL2zfweuJuIu2fJI1vgjETrItdJTSZf1tg",
  "PL2zfweuJuIu3TH8oA7Qyo9lNImqPmbN1f",
  "PL2zfweuJuIu3zFajHrQ7_KcyE16FAGBMz",
  "PL2zfweuJuIu0QIXSSSQBZh34PaEMBu9TR",
  "PL2zfweuJuIu1UmFInMfEZJd5i5ehvGDKp",
  "PL2zfweuJuIu1-JGSl_xk9LfnFtLu1TJ77",
  "PL2zfweuJuIu31qE-KQByQex3dKuXi33nG",
  "PL2zfweuJuIu0FMp2ycEm2_UzUZpleOdnO",
  "PL2zfweuJuIu1SFp6bSvFcYoQ-sxA2yeSx",
  "PL2zfweuJuIu2IU1gqoqlM0ujjcstj_Pa2",
  "PL2zfweuJuIu3SXfmIHh3oYcjB9tmKFYhf",
  "PL2zfweuJuIu3jABlPtZhD_SxaW6_WR95G",
  "PL2zfweuJuIu3v6sH9UPHBI8NPoSk8Li-S",
  "PL2zfweuJuIu0GuujtTY1OxXE0ahiuB0uv",
  "PL2zfweuJuIu1wXNsPSRF43YLuTdG87eH4",
  "PL2zfweuJuIu3TYElsbfOcsXmR69mysMD5",
  "PL2zfweuJuIu1r6w6vYH_sJtbduEFc-RFa",
];

function cleanText(str) {
  return (str || "")
    .replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ").trim();
}

async function scrapePlaylist(id) {
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${id}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const xml = await res.text();

    // Extract playlist/feed title
    const titleMatch = xml.match(/<title>([\s\S]*?)<\/title>/);
    const feedTitle = titleMatch ? cleanText(titleMatch[1]) : null;

    // Extract video entries
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const entries = [];
    let m;
    while ((m = entryRegex.exec(xml)) !== null) {
      const entry = m[1];
      const vidMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch2 = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const viewsMatch = entry.match(/<media:statistics views="(\d+)"/);
      if (vidMatch) {
        entries.push({
          videoId: vidMatch[1],
          title: cleanText(titleMatch2?.[1] || ""),
          publishedAt: publishedMatch?.[1] || null,
          views: viewsMatch ? parseInt(viewsMatch[1]).toLocaleString("en-IN") : null,
        });
      }
    }

    if (!entries.length) return null;

    const firstVideoId = entries[0].videoId;
    return {
      id,
      title: feedTitle,
      url: `https://www.youtube.com/playlist?list=${id}`,
      thumbnail: `https://img.youtube.com/vi/${firstVideoId}/hqdefault.jpg`,
      thumbnailMq: `https://img.youtube.com/vi/${firstVideoId}/mqdefault.jpg`,
      firstVideoId,
      videoCount: entries.length, // RSS caps at 15; actual may be more
      recentVideos: entries.slice(0, 5),
    };
  } catch (e) {
    console.error(`  ❌ ${id}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log("📋 Dr. Praduman Khachar — Playlist Scraper");
  console.log("═".repeat(50));
  console.log(`🔄 Processing ${PLAYLIST_IDS.length} playlists...\n`);

  const results = [];
  let ok = 0, fail = 0;

  for (let i = 0; i < PLAYLIST_IDS.length; i++) {
    const id = PLAYLIST_IDS[i];
    const progress = `[${String(i + 1).padStart(2)}/${PLAYLIST_IDS.length}]`;
    process.stdout.write(`${progress} ${id}... `);

    const data = await scrapePlaylist(id);
    if (data) {
      results.push(data);
      ok++;
      console.log(`✅ ${data.title?.slice(0, 50) || "untitled"} (${data.videoCount} videos)`);
    } else {
      fail++;
      console.log("❌ failed / empty");
    }

    await sleep(DELAY_MS);
  }

  // Sort by video count desc
  results.sort((a, b) => b.videoCount - a.videoCount);

  const outDir = join(ROOT, "public", "data");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "playlists.json");

  writeFileSync(outPath, JSON.stringify({
    scraped_at: new Date().toISOString(),
    total: results.length,
    playlists: results,
  }, null, 2), "utf8");

  console.log("\n" + "═".repeat(50));
  console.log(`✅ ${results.length} playlists → public/data/playlists.json`);
  console.log(`   ${ok} OK / ${fail} failed`);
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
