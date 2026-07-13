/**
 * /gallery — Newspaper column archive (Gujarat Column)
 *
 * Public archive of Dr. Praduman Khachar's "ગુજરાત કોલમ" newspaper column
 * published in regional Gujarati newspapers. Images are the public, free
 * preview-quality scans. High-resolution originals and metadata are
 * reserved for the (forthcoming) membership tier.
 *
 * The manifest at /public/gallery/manifest.json is generated at build time
 * (see scripts/gen-gallery.mjs). The full original image is also served
 * from /public/gallery/ — for now the same files are the "HD" version,
 * but the gate is wired in so adding paid HD sources later is one config
 * change.
 */

import { useEffect, useState, useMemo } from "react";
import {
  X,
  Download,
  Lock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Expand,
  Grid as GridIcon,
  Search,
  ArrowUpRight,
} from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import PageHeader from "../components/PageHeader";

interface GalleryItem {
  id: string;
  src: string;
  width: number;
  height: number;
}

export default function Gallery() {
  usePageTitle("Gujarat Column — Newspaper Archive");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "masonry">("masonry");

  useEffect(() => {
    fetch("/gallery/manifest.json")
      .then((r) => r.json())
      .then((d: GalleryItem[]) => {
        setItems(d);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: discover images via a static list (in case manifest is missing)
        setItems([]);
        setLoading(false);
      });
  }, []);

  // Build the membership "HD" link. Real version will be wired to a
  // /api/membership/check endpoint once auth is in place.
  const hdGate = useMemo(
    () => ({
      title: "HD Originals — Members Only",
      blurb:
        "High-resolution, lossless scans of every clipping — including full OCR'd text, original publication metadata, and downloadable PDFs — are part of the supporting-membership tier.",
      cta: "Become a member",
      href: "/support",
    }),
    [],
  );

  const filtered = items; // for now no metadata-based filter
  void search;

  // Keyboard nav for lightbox
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, items.length]);

  return (
    <>
      <PageHeader
        label="Archive"
        title="Gujarat Column"
        subtitle="ગુજરાત કોલમ — A growing archive of Dr. Praduman Khachar's published newspaper columns from regional Gujarati dailies including Gujarat Samachar. Preview-quality scans are free to read; high-resolution originals are reserved for supporting members."
        dark
      />

      <main className="section gallery-page">
        <style>{`
          .gallery-page { padding-top: 0; }

          .gallery-toolbar {
            display: flex;
            gap: 1rem;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
            flex-wrap: wrap;
          }
          .gallery-toolbar-left {
            display: flex;
            gap: 0.75rem;
            align-items: center;
            color: var(--c-ink-muted);
            font-family: var(--font-body);
            font-size: 0.85rem;
          }
          .gallery-search {
            display: flex;
            align-items: center;
            gap: 6px;
            border: 1px solid var(--c-border);
            border-radius: 999px;
            padding: 6px 14px;
            background: var(--c-parchment-deep);
            color: var(--c-ink-muted);
            font-family: var(--font-body);
            font-size: 0.85rem;
            min-width: 220px;
          }
          [data-theme="dark"] .gallery-search {
            background: rgba(255,255,255,0.04);
            border-color: rgba(255,255,255,0.1);
          }
          .gallery-search input {
            background: none;
            border: none;
            outline: none;
            color: var(--c-ink);
            font-family: inherit;
            font-size: inherit;
            width: 100%;
          }
          .gallery-view-toggle {
            display: inline-flex;
            border: 1px solid var(--c-border);
            border-radius: 999px;
            overflow: hidden;
          }
          .gallery-view-toggle button {
            background: none;
            border: none;
            padding: 6px 14px;
            cursor: pointer;
            color: var(--c-ink-muted);
            font-family: var(--font-body);
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .gallery-view-toggle button.active {
            background: var(--c-terracotta);
            color: white;
          }

          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 16px;
            align-items: start;
          }
          .gallery-grid.masonry {
            display: block;
            column-count: 4;
            column-gap: 16px;
          }
          @media (max-width: 1100px) { .gallery-grid.masonry { column-count: 3; } }
          @media (max-width: 700px)  { .gallery-grid.masonry { column-count: 2; } .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); } }
          @media (max-width: 480px)  { .gallery-grid.masonry { column-count: 1; } }

          .gallery-tile {
            display: block;
            break-inside: avoid;
            margin-bottom: 16px;
            cursor: zoom-in;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          [data-theme="dark"] .gallery-tile {
            background: rgba(255,255,255,0.04);
            border-color: rgba(255,255,255,0.08);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }
          .gallery-tile:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            border-color: var(--c-terracotta);
          }
          .gallery-tile img {
            display: block;
            width: 100%;
            height: auto;
          }
          .gallery-tile-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: oklch(0.2 0.04 60 / 0.7);
            color: white;
            font-family: var(--font-body);
            font-size: 0.65rem;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .gallery-empty {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--c-ink-muted);
            font-family: var(--font-body);
          }

          /* Lightbox */
          .lightbox {
            position: fixed;
            inset: 0;
            z-index: 2000;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
            display: flex;
            flex-direction: column;
            animation: fadein 0.25s ease-out;
          }
          @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
          .lightbox-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            color: white;
            font-family: var(--font-body);
            font-size: 0.85rem;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .lightbox-actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
          }
          .lightbox-btn {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          .lightbox-btn:hover { background: rgba(255,255,255,0.15); }
          .lightbox-btn.primary { background: var(--c-terracotta); border-color: var(--c-terracotta); width: auto; padding: 0 16px; border-radius: 999px; gap: 6px; font-size: 0.82rem; }
          .lightbox-btn.primary:hover { background: var(--c-terracotta-light); }

          .lightbox-body {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }
          .lightbox-image-wrap {
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .lightbox-image-wrap img {
            max-height: 85vh;
            width: auto;
            transition: transform 0.3s ease;
            border-radius: 2px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          }

          .lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          .lightbox-nav:hover { background: rgba(255,255,255,0.18); }
          .lightbox-nav.prev { left: 1rem; }
          .lightbox-nav.next { right: 1rem; }

          .lightbox-counter {
            color: rgba(255,255,255,0.6);
            font-size: 0.78rem;
            font-variant-numeric: tabular-nums;
          }

          /* HD modal */
          .hd-modal {
            position: fixed;
            inset: 0;
            z-index: 2100;
            background: rgba(10, 10, 10, 0.7);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            animation: fadein 0.2s ease-out;
          }
          .hd-modal-card {
            background: var(--c-parchment);
            border-radius: 16px;
            padding: 2.5rem;
            max-width: 440px;
            width: 100%;
            text-align: center;
            box-shadow: 0 40px 100px rgba(0,0,0,0.4);
            position: relative;
          }
          [data-theme="dark"] .hd-modal-card {
            background: #1a1a1a;
            color: #fff;
          }
          .hd-modal-icon {
            width: 56px;
            height: 56px;
            margin: 0 auto 1rem;
            border-radius: 50%;
            background: color-mix(in oklch, var(--c-amber) 15%, transparent);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--c-amber);
          }
          .hd-modal-card h3 {
            font-family: var(--font-display);
            font-size: 1.4rem;
            margin-bottom: 0.5rem;
          }
          .hd-modal-card p {
            color: var(--c-ink-muted);
            font-family: var(--font-body);
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
          }
          .hd-modal-card a {
            display: inline-block;
            background: var(--c-terracotta);
            color: white;
            padding: 10px 24px;
            border-radius: 999px;
            text-decoration: none;
            font-family: var(--font-body);
            font-weight: 600;
            font-size: 0.88rem;
            transition: background 0.2s;
          }
          .hd-modal-card a:hover { background: var(--c-terracotta-light); }
          .hd-modal-card .close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: var(--c-ink-muted);
            cursor: pointer;
            font-size: 1.2rem;
          }
        `}</style>

        {/* Toolbar */}
        <div className="gallery-toolbar">
          <div className="gallery-toolbar-left">
            <span><Calendar size={14} style={{ verticalAlign: "middle" }} /> {items.length} clippings</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ textTransform: "capitalize" }}>Gujarat Column</span>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <div className="gallery-search">
              <Search size={14} />
              <input
                placeholder="Search clippings…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search gallery"
              />
            </div>
            <div className="gallery-view-toggle">
              <button
                className={view === "masonry" ? "active" : ""}
                onClick={() => setView("masonry")}
                aria-label="Masonry view"
              >
                <GridIcon size={14} /> Masonry
              </button>
              <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <Expand size={14} /> Grid
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="gallery-empty">Loading archive…</div>
        ) : filtered.length === 0 ? (
          <div className="gallery-empty">No clippings yet.</div>
        ) : (
          <div className={`gallery-grid${view === "masonry" ? " masonry" : ""}`}>
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="gallery-tile"
                onClick={() => {
                  setOpenIdx(i);
                  setZoom(1);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIdx(i);
                    setZoom(1);
                  }
                }}
                aria-label={`Open clipping ${i + 1}`}
              >
                <img src={item.src} alt={`Newspaper clipping ${i + 1}`} loading="lazy" />
                <span className="gallery-tile-badge">
                  <Lock size={9} /> Preview
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {openIdx !== null && items[openIdx] && (
          <Lightbox
            items={items}
            index={openIdx}
            onIndexChange={setOpenIdx}
            onClose={() => setOpenIdx(null)}
            zoom={zoom}
            setZoom={setZoom}
            hdGate={hdGate}
          />
        )}
      </main>
    </>
  );
}

function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
  zoom,
  setZoom,
  hdGate,
}: {
  items: GalleryItem[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  zoom: number;
  setZoom: (z: number) => void;
  hdGate: { title: string; blurb: string; cta: string; href: string };
}) {
  const [hdOpen, setHdOpen] = useState(false);
  const item = items[index];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
      <div className="lightbox-header">
        <span className="lightbox-counter">
          {index + 1} / {items.length}
        </span>
        <div className="lightbox-actions">
          <button
            className="lightbox-btn"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", minWidth: 44, textAlign: "center" }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="lightbox-btn"
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            className="lightbox-btn"
            onClick={() => setZoom(1)}
            aria-label="Reset zoom"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
          <button
            className="lightbox-btn primary"
            onClick={() => setHdOpen(true)}
            title="Download HD"
          >
            <Lock size={14} /> HD
          </button>
          <button className="lightbox-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="lightbox-body">
        <button
          className="lightbox-nav prev"
          onClick={() => onIndexChange((index - 1 + items.length) % items.length)}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="lightbox-image-wrap">
          <img src={item.src} alt={`Clipping ${index + 1}`} style={{ transform: `scale(${zoom})` }} />
        </div>
        <button
          className="lightbox-nav next"
          onClick={() => onIndexChange((index + 1) % items.length)}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {hdOpen && (
        <div className="hd-modal" onClick={() => setHdOpen(false)}>
          <div className="hd-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setHdOpen(false)} aria-label="Close">
              <X size={18} />
            </button>
            <div className="hd-modal-icon">
              <Lock size={24} />
            </div>
            <h3>{hdGate.title}</h3>
            <p>{hdGate.blurb}</p>
            <a href={hdGate.href}>
              {hdGate.cta} <ArrowUpRight size={14} style={{ verticalAlign: "middle", marginLeft: 4 }} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
