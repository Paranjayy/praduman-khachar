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

import { readdir, writeFile, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { execSync } from "node:child_process";
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
    column: "Mumbai Samachar Column",
    columnGu: "મુંબઈ સમાચાર કોલમ",
  },
};

function getDimensions(file) {
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight "${file}"`, {
      encoding: "utf8",
    });
    const w = parseInt(out.match(/pixelWidth:\s*(\d+)/)?.[1] || "0", 10);
    const h = parseInt(out.match(/pixelHeight:\s*(\d+)/)?.[1] || "0", 10);
    return { w, h };
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
      const { w, h } = getDimensions(fullPath);
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
