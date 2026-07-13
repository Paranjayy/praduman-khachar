/**
 * gen-gallery.mjs
 *
 * Scans /public/gallery/ and emits /public/gallery/manifest.json listing
 * every image with its dimensions. The Gallery page reads this at runtime
 * to render the masonry grid + lightbox.
 *
 * Run automatically before each build (see package.json scripts).
 */

import { readdir, writeFile, readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const GALLERY_DIR = join(ROOT, "public", "gallery");
const MANIFEST_PATH = join(GALLERY_DIR, "manifest.json");

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

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

async function main() {
  let files;
  try {
    files = await readdir(GALLERY_DIR);
  } catch (e) {
    console.warn(`gen-gallery: gallery dir not found (${GALLERY_DIR})`);
    await writeFile(MANIFEST_PATH, "[]");
    return;
  }

  const items = [];
  let i = 0;
  for (const f of files.sort()) {
    const ext = extname(f).toLowerCase();
    if (!SUPPORTED.has(ext)) continue;
    const fullPath = join(GALLERY_DIR, f);
    const { w, h } = getDimensions(fullPath);
    items.push({
      id: `g${String(++i).padStart(4, "0")}`,
      src: `/gallery/${f}`,
      width: w,
      height: h,
    });
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(items, null, 2));
  console.log(`✅ Generated gallery manifest with ${items.length} items`);
}

main().catch((e) => {
  console.error("gen-gallery failed:", e);
  process.exit(1);
});
