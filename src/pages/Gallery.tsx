/**
 * /gallery — Multi-outlet newspaper column archive
 *
 * Three columns published by Dr. Praduman Khachar across regional
 * Gujarati dailies:
 *   1. Gujarat Column (Gujarat Samachar)
 *   2. Fulchhab Column (Fulchhab)
 *   3. Mumbai Samachar Column
 *
 * Free tier: low-res watermarked preview.
 * Paid tier (membership, coming soon): HD original downloads.
 *
 * Manifest at /public/gallery/manifest.json is generated at build time.
 */

import { useEffect, useState, useMemo } from "react";
import {
  X,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Expand,
  Grid as GridIcon,
  Search,
  ArrowUpRight,
  Download,
  Newspaper,
  FileText,
} from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import PageHeader from "../components/PageHeader";

interface GalleryItem {
  id: string;
  src: string;
  width: number;
  height: number;
  outlet: string;
  outletName: string;
  outletNameGu: string;
  column: string;
  columnGu: string;
  date: string | null;
  bytes: number;
}

type SortMode = "newest" | "oldest" | "largest" | "smallest";

export default function Gallery() {
  usePageTitle("Newspaper Columns — Archive");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "masonry">("masonry");
  const [outletFilter, setOutletFilter] = useState<string>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [hdOpen, setHdOpen] = useState(false);

  useEffect(() => {
    fetch("/gallery/manifest.json")
      .then((r) => r.json())
      .then((d: GalleryItem[]) => {
        setItems(d);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  }, []);

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

  const outlets = useMemo(() => {
    const seen = new Map<string, { slug: string; name: string; nameGu: string; count: number }>();
    for (const item of items) {
      if (!seen.has(item.outlet)) {
        seen.set(item.outlet, {
          slug: item.outlet,
          name: item.outletName,
          nameGu: item.outletNameGu,
          count: 0,
        });
      }
      seen.get(item.outlet)!.count++;
    }
    return Array.from(seen.values());
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (outletFilter !== "all") {
      result = result.filter((i) => i.outlet === outletFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.column.toLowerCase().includes(q) ||
          i.outletName.toLowerCase().includes(q) ||
          (i.date && i.date.includes(q)),
      );
    }
    const sorted = [...result];
    sorted.sort((a, b) => {
      switch (sortMode) {
        case "newest":
          if (a.date && b.date) return b.date.localeCompare(a.date);
          return 0;
        case "oldest":
          if (a.date && b.date) return a.date.localeCompare(b.date);
          return 0;
        case "largest":
          return b.bytes - a.bytes;
        case "smallest":
          return a.bytes - b.bytes;
        default:
          return 0;
      }
    });
    return sorted;
  }, [items, outletFilter, search, sortMode]);

  const pdfItems = useMemo(
    () => items.filter((i) => i.src.endsWith(".pdf")),
    [items],
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") {
        setOpenIdx((i) => (i === null ? null : (i + 1) % filtered.length));
      }
      if (e.key === "ArrowLeft") {
        setOpenIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, filtered.length]);

  return (
    <>
      <PageHeader
        label="Archive"
        title="Newspaper Columns"
        subtitle="અખબારી કોલમ — Three regular columns published by Dr. Praduman Khachar across Gujarat's leading dailies. Preview-quality scans are free to read; high-resolution originals are reserved for supporting members."
        dark
      />

      <main className="section gallery-page">
        <style>{`
          .gallery-page { padding-top: 0; }
          .outlet-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .outlet-card {
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border);
            border-radius: 10px;
            padding: 1.2rem 1.4rem;
            cursor: pointer;
            transition: all 0.25s ease;
            text-align: left;
            font-family: var(--font-body);
            color: var(--c-ink);
            position: relative;
            overflow: hidden;
            background: none;
            border: 1px solid var(--c-border);
          }
          [data-theme="dark"] .outlet-card {
            background: rgba(255,255,255,0.04);
            border-color: rgba(255,255,255,0.08);
          }
          .outlet-card:hover, .outlet-card.active {
            border-color: var(--c-terracotta);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          }
          .outlet-card.active { background: color-mix(in oklch, var(--c-terracotta) 8%, var(--c-parchment-deep)); }
          [data-theme="dark"] .outlet-card.active { background: color-mix(in oklch, var(--c-terracotta) 12%, rgba(255,255,255,0.04)); }
          .outlet-card-name {
            font-family: var(--font-display);
            font-size: 1.15rem;
            font-weight: 700;
            margin-bottom: 0.15rem;
            line-height: 1.2;
          }
          .outlet-card-name-gu {
            font-family: var(--font-gujarati);
            font-size: 0.95rem;
            opacity: 0.6;
            margin-bottom: 0.5rem;
          }
          .outlet-card-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.78rem;
            color: var(--c-ink-muted);
            border-top: 1px solid var(--c-border);
            padding-top: 0.6rem;
            margin-top: 0.6rem;
          }
          .outlet-card-count {
            font-family: var(--font-mono);
            font-weight: 700;
            color: var(--c-terracotta);
            font-size: 0.85rem;
          }
          .gallery-toolbar {
            display: flex;
            gap: 0.75rem;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            padding: 0.8rem 1rem;
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border);
            border-radius: 12px;
          }
          [data-theme="dark"] .gallery-toolbar {
            background: rgba(255,255,255,0.04);
            border-color: rgba(255,255,255,0.08);
          }
          .gallery-search {
            display: flex;
            align-items: center;
            gap: 6px;
            background: var(--c-parchment);
            border: 1px solid var(--c-border);
            border-radius: 999px;
            padding: 6px 14px;
            color: var(--c-ink-muted);
            font-family: var(--font-body);
            font-size: 0.85rem;
            min-width: 220px;
          }
          [data-theme="dark"] .gallery-search {
            background: rgba(0,0,0,0.2);
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
          .gallery-select {
            background: var(--c-parchment);
            border: 1px solid var(--c-border);
            border-radius: 999px;
            padding: 6px 14px;
            color: var(--c-ink);
            font-family: var(--font-body);
            font-size: 0.85rem;
            cursor: pointer;
            outline: none;
          }
          [data-theme="dark"] .gallery-select {
            background: rgba(0,0,0,0.2);
            color: var(--c-ink);
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
            padding: 6px 12px;
            cursor: pointer;
            color: var(--c-ink-muted);
            font-family: var(--font-body);
            font-size: 0.78rem;
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
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 14px;
            align-items: start;
          }
          .gallery-grid.masonry {
            display: block;
            column-count: 4;
            column-gap: 14px;
          }
          @media (max-width: 1100px) { .gallery-grid.masonry { column-count: 3; } }
          @media (max-width: 700px)  { .gallery-grid.masonry { column-count: 2; } .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); } }
          @media (max-width: 480px)  { .gallery-grid.masonry { column-count: 1; } }
          .gallery-tile {
            display: block;
            break-inside: avoid;
            margin-bottom: 14px;
            cursor: zoom-in;
            position: relative;
            border-radius: 6px;
            overflow: hidden;
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
          }
          [data-theme="dark"] .gallery-tile {
            background: rgba(255,255,255,0.04);
            border-color: rgba(255,255,255,0.08);
          }
          .gallery-tile:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 24px rgba(0,0,0,0.12);
            border-color: var(--c-terracotta);
          }
          .gallery-tile img {
            display: block;
            width: 100%;
            height: auto;
          }
          .gallery-tile-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 8px;
            background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.65) 100%);
            opacity: 0;
            transition: opacity 0.25s;
            pointer-events: none;
          }
          .gallery-tile:hover .gallery-tile-overlay { opacity: 1; }
          .gallery-tile-overlay-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 6px;
          }
          .gallery-tile-overlay-bottom {
            color: white;
            font-family: var(--font-body);
            font-size: 0.72rem;
            line-height: 1.3;
          }
          .gallery-tile-outlet {
            background: rgba(0,0,0,0.65);
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: var(--font-body);
            font-size: 0.7rem;
            font-weight: 600;
            backdrop-filter: blur(4px);
          }
          .gallery-tile-date {
            color: rgba(255,255,255,0.85);
            font-variant-numeric: tabular-nums;
          }
          .gallery-tile-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: oklch(0.2 0.04 60 / 0.7);
            color: white;
            font-family: var(--font-body);
            font-size: 0.6rem;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: flex;
            align-items: center;
            gap: 3px;
            backdrop-filter: blur(4px);
          }
          .gallery-empty {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--c-ink-muted);
            font-family: var(--font-body);
          }
          .pdf-section {
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border);
            border-radius: 12px;
            padding: 1.2rem 1.4rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
          }
          [data-theme="dark"] .pdf-section {
            background: rgba(255,255,255,0.04);
            border-color: rgba(255,255,255,0.08);
          }
          .pdf-section-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: color-mix(in oklch, var(--c-amber) 18%, transparent);
            color: var(--c-amber);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .pdf-section-info { flex: 1; min-width: 200px; }
          .pdf-section-title {
            font-family: var(--font-display);
            font-size: 1.05rem;
            font-weight: 700;
            color: var(--c-ink);
            margin-bottom: 0.15rem;
          }
          .pdf-section-meta {
            color: var(--c-ink-muted);
            font-family: var(--font-body);
            font-size: 0.82rem;
          }
          .pdf-section-btn {
            background: var(--c-terracotta);
            color: white;
            padding: 8px 16px;
            border-radius: 999px;
            text-decoration: none;
            font-family: var(--font-body);
            font-weight: 600;
            font-size: 0.82rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: background 0.2s;
          }
          .pdf-section-btn:hover { background: var(--c-terracotta-light); }
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
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .lightbox-meta {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .lightbox-meta-title {
            font-family: var(--font-display);
            font-size: 0.95rem;
            font-weight: 700;
          }
          .lightbox-meta-sub {
            color: rgba(255,255,255,0.6);
            font-size: 0.75rem;
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

        {/* Outlet cards */}
        {outlets.length > 0 && (
          <div className="outlet-cards">
            <button
              className={`outlet-card${outletFilter === "all" ? " active" : ""}`}
              onClick={() => setOutletFilter("all")}
            >
              <div className="outlet-card-name">All Columns</div>
              <div className="outlet-card-name-gu">બધી કોલમ</div>
              <div className="outlet-card-meta">
                <span>{items.length} total</span>
                <span className="outlet-card-count">{outlets.length} outlets</span>
              </div>
            </button>
            {outlets.map((o) => (
              <button
                key={o.slug}
                className={`outlet-card${outletFilter === o.slug ? " active" : ""}`}
                onClick={() => setOutletFilter(o.slug)}
              >
                <div className="outlet-card-name">{o.name}</div>
                <div className="outlet-card-name-gu">{o.nameGu}</div>
                <div className="outlet-card-meta">
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>
                    {o.slug === "gujarat-samachar" && "Gujarat Column · ગુજરાત કોલમ"}
                    {o.slug === "fulchhab" && "Fulchhab Column · ફૂલછાબ કોલમ"}
                    {o.slug === "mumbai-samachar" && "Mumbai Samachar · મુંબઈ સમાચાર કોલમ"}
                  </span>
                  <span className="outlet-card-count">{o.count}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="gallery-toolbar">
          <div className="gallery-search">
            <Search size={14} />
            <input
              placeholder="Search by outlet, column, or date…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search gallery"
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <select
              className="gallery-select"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              aria-label="Sort"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="largest">Largest first</option>
              <option value="smallest">Smallest first</option>
            </select>
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

        {/* PDF section */}
        {pdfItems.length > 0 && (
          <div className="pdf-section">
            <div className="pdf-section-icon">
              <FileText size={20} />
            </div>
            <div className="pdf-section-info">
              <div className="pdf-section-title">Full Columns (PDF)</div>
              <div className="pdf-section-meta">
                Original full-text columns — free to download, no membership required
              </div>
            </div>
            {pdfItems.map((p) => (
              <a key={p.id} href={p.src} target="_blank" rel="noopener noreferrer" className="pdf-section-btn">
                <Download size={14} /> {decodeURIComponent(p.src.split("/").pop() || "Download")}
              </a>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="gallery-empty">Loading archive…</div>
        ) : filtered.length === 0 ? (
          <div className="gallery-empty">No clippings match the current filters.</div>
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
                aria-label={`Open ${item.outletName} clipping from ${item.date || "unknown date"}`}
              >
                <img src={item.src} alt={`${item.outletName} clipping`} loading="lazy" />
                <div className="gallery-tile-overlay">
                  <div className="gallery-tile-overlay-top">
                    <span className="gallery-tile-outlet">{item.outletName}</span>
                  </div>
                  <div className="gallery-tile-overlay-bottom">
                    {item.column}
                    {item.date && <span className="gallery-tile-date"> · {item.date}</span>}
                  </div>
                </div>
                <span className="gallery-tile-badge">
                  <Lock size={9} /> Preview
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {openIdx !== null && filtered[openIdx] && (
          <Lightbox
            items={filtered}
            index={openIdx}
            onIndexChange={setOpenIdx}
            onClose={() => setOpenIdx(null)}
            zoom={zoom}
            setZoom={setZoom}
            hdGate={hdGate}
            hdOpen={hdOpen}
            setHdOpen={setHdOpen}
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
  hdOpen,
  setHdOpen,
}: {
  items: GalleryItem[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  zoom: number;
  setZoom: (z: number) => void;
  hdGate: { title: string; blurb: string; cta: string; href: string };
  hdOpen: boolean;
  setHdOpen: (v: boolean) => void;
}) {
  const item = items[index];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
      <div className="lightbox-header">
        <div className="lightbox-meta">
          <div className="lightbox-meta-title">
            {item.outletName} — {item.column}
          </div>
          <div className="lightbox-meta-sub">
            {item.date || "Date unknown"} · {index + 1} of {items.length} · {Math.round(item.bytes / 1024)} KB
          </div>
        </div>
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
          <img src={item.src} alt={`${item.outletName} clipping`} style={{ transform: `scale(${zoom})` }} />
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
