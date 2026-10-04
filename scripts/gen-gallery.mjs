/**
 * gen-gallery.mjs
 *
 * Scans /public/gallery/<outlet>/ subdirs and emits
 * /public/gallery/manifest.json. Each entry has:
 *   - id        : unique slug
 *   - src       : public URL
 *   - width     : pixel width
 *   - height    : pixel height
 *   - outlet    : which newspaper (gujarat-samachar, fulchhab, mumbai-samachar)
 *   - column    : column name
 *   - date      : ISO date if known (extracted from FB timestamps in filenames)
 *   - bytes     : file size
 *
 * Run automatically before each build (see package.json scripts).
 */

import { readdir, writeFile, stat, readFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const GALLERY_DIR = join(ROOT, "public", "gallery");
const MANIFEST_PATH = join(GALLERY_DIR, "manifest.json");

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const OUTLETS = {
  "gujarat-samachar": {
    name: "Gujarat Samachar",
    nameGu: "ગુજરાત સમાચાર",
    column: "Gujarat Column",
    columnGu: "ગુજરાત કોલમ",
  },
  "fulchhab": {
    name: "Fulchhab",
    nameGu: "ફૂલછાબ",
    column: "Fulchhab Column",
    columnGu: "ફૂલછાબ કોલમ",
  },
  "mumbai-samachar": {
    name: "Mumbai Samachar",
    nameGu: "મુંબઈ સમાચાર",
    column: "Lok Katha Ni Vato",
    columnGu: "લોક કથા ની વાતો",
  },
};

function parsePngDimensions(buffer) {
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    return null;
  }
  return {
    w: buffer.readUInt32BE(16),
    h: buffer.readUInt32BE(20),
  };
}

function parseJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    if (marker === 0xd9 || marker === 0xda) break;
    if (offset + 4 > buffer.length) break;

    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (segmentLength < 2 || offset + 2 + segmentLength > buffer.length) break;

    const isSofMarker =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isSofMarker && offset + 9 < buffer.length) {
      return {
        h: buffer.readUInt16BE(offset + 5),
        w: buffer.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + segmentLength;
  }

  return null;
}

function parseWebpDimensions(buffer) {
  if (buffer.length < 16) return null;
  if (buffer.subarray(0, 4).toString() !== "RIFF") return null;
  if (buffer.subarray(8, 12).toString() !== "WEBP") return null;

  const chunkType = buffer.subarray(12, 16).toString();

  if (chunkType === "VP8X" && buffer.length >= 30) {
    const w = 1 + buffer.readUIntLE(24, 3);
    const h = 1 + buffer.readUIntLE(27, 3);
    return { w, h };
  }

  if (chunkType === "VP8L" && buffer.length >= 25) {
    const b1 = buffer[21];
    const b2 = buffer[22];
    const b3 = buffer[23];
    const b4 = buffer[24];
    const w = 1 + (((b2 & 0x3f) << 8) | b1);
    const h = 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
    return { w, h };
  }

  if (chunkType === "VP8 " && buffer.length >= 30) {
    for (let i = 20; i + 10 < buffer.length; i += 1) {
      if (buffer[i] === 0x9d && buffer[i + 1] === 0x01 && buffer[i + 2] === 0x2a) {
        return {
          w: buffer.readUInt16LE(i + 3) & 0x3fff,
          h: buffer.readUInt16LE(i + 5) & 0x3fff,
        };
      }
    }
  }

  return null;
}

async function getDimensions(file) {
  try {
    const buffer = await readFile(file);
    const parsed =
      parsePngDimensions(buffer) || parseJpegDimensions(buffer) || parseWebpDimensions(buffer);
    return parsed || { w: 0, h: 0 };
  } catch {
    return { w: 0, h: 0 };
  }
}

/**
 * Try to extract a date from the filename.
 * Supported patterns:
 *  - FB_IMG_1472036239760.jpg   -> first 10 digits = unix seconds
 *  - 1473561382730.jpg          -> first 10 digits = unix seconds
 *  - UTSAV-SUN-11-09-2016-Page-04-page-001-2.jpg
 */
function extractDate(name) {
  // FB_IMG_ pattern
  let m = name.match(/^(?:FB_IMG_)?(\d{10,13})/);
  if (m) {
    let ts = parseInt(m[1], 10);
    if (ts > 1e12) ts = Math.floor(ts / 1000); // ms -> s
    const d = new Date(ts * 1000);
    if (!isNaN(d.getTime()) && d.getFullYear() > 1990) {
      return d.toISOString().slice(0, 10);
    }
  }
  // Date in middle of filename (DD-MM-YYYY or YYYY-MM-DD)
  m = name.match(/(\d{2}-\d{2}-\d{4})/);
  if (m) {
    const [dd, mm, yyyy] = m[1].split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  m = name.match(/(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  return null;
}

async function main() {
  const items = [];
  let idx = 0;

  for (const [outletSlug, outlet] of Object.entries(OUTLETS)) {
    const dir = join(GALLERY_DIR, outletSlug);
    let files;
    try {
      files = await readdir(dir);
    } catch {
      continue;
    }
    files.sort();
    for (const f of files) {
      const ext = extname(f).toLowerCase();
      if (!SUPPORTED.has(ext)) continue;
      const fullPath = join(dir, f);
      const { w, h } = await getDimensions(fullPath);
      const st = await stat(fullPath);
      items.push({
        id: `g${String(++idx).padStart(4, "0")}`,
        src: `/gallery/${outletSlug}/${f}`,
        width: w,
        height: h,
        outlet: outletSlug,
        outletName: outlet.name,
        outletNameGu: outlet.nameGu,
        column: outlet.column,
        columnGu: outlet.columnGu,
        date: extractDate(f),
        bytes: st.size,
      });
    }
  }

  // Sort by date desc (newest first), then by outlet
  items.sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  await writeFile(MANIFEST_PATH, JSON.stringify(items, null, 2));
  console.log(`✅ Generated gallery manifest: ${items.length} items`);

  // Summary by outlet
  const byOutlet = {};
  for (const item of items) {
    byOutlet[item.outlet] = (byOutlet[item.outlet] || 0) + 1;
  }
  for (const [k, v] of Object.entries(byOutlet)) {
    console.log(`   ${k}: ${v}`);
  }
}

main().catch((e) => {
  console.error("gen-gallery failed:", e);
  process.exit(1);
});
