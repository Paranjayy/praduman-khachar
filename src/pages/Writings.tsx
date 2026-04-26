/**
 * src/pages/Writings.tsx
 *
 * Dr. Khachar's authored writings — essays, notes, research articles.
 * Filter by category, language, tags; sort by date.
 * Stripe-Press-inspired: click to open full detail panel.
 */

import { useState, useMemo } from "react";
import { track } from "@vercel/analytics";
import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { WRITINGS, WRITING_CATEGORIES, type Writing } from "../data/writings";

// ── WRITING CARD ──────────────────────────────────────────────────────────────
function WritingCard({ w, onOpen }: { w: Writing; onOpen: (w: Writing) => void }) {
  const cat = WRITING_CATEGORIES[w.category];
  const dateStr = new Date(w.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article
      className="writing-card"
      onClick={() => {
        track("writing_open", { id: w.id, title: w.titleEn || w.title });
        onOpen(w);
      }}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(w)}
      role="button"
      aria-label={`Read: ${w.titleEn || w.title}`}
    >
      <div className="writing-card-meta">
        <span className="writing-lang-pill">{w.lang.toUpperCase()}</span>
        <span
          className="writing-cat-pill"
          style={{ color: cat?.color || "var(--c-terracotta)" }}
        >
          {cat?.label || w.category}
        </span>
        <time className="writing-date">{dateStr}</time>
      </div>
      <h2 className="writing-title">{w.title}</h2>
      {w.titleEn && <p className="writing-title-en">{w.titleEn}</p>}
      <p className="writing-excerpt">{w.excerpt}</p>
      <div className="writing-tags">
        {w.tags.slice(0, 5).map((t) => (
          <span key={t} className="writing-tag">
            {t}
          </span>
        ))}
      </div>
      <div className="writing-card-footer">
        <span className="writing-read-cta">Read article →</span>
        {w.featured && <span className="writing-featured-badge">Featured</span>}
      </div>
    </article>
  );
}

// ── DETAIL PANEL (Stripe-Press style) ─────────────────────────────────────────
function WritingDetail({ w, onClose }: { w: Writing; onClose: () => void }) {
  const cat = WRITING_CATEGORIES[w.category];
  const dateStr = new Date(w.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const wordCount = w.content.join(" ").split(/\s+/).length;
  const readMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="writing-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="writing-detail-panel" role="dialog" aria-modal="true">
        <button className="writing-detail-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="writing-detail-meta">
          <span
            className="writing-cat-pill"
            style={{ color: cat?.color || "var(--c-terracotta)" }}
          >
            {cat?.label || w.category}
          </span>
          {cat?.labelGu && (
            <span className="writing-cat-gu">{cat.labelGu}</span>
          )}
          <time className="writing-date">{dateStr}</time>
          <span className="writing-read-time">~{readMin} min read</span>
        </div>

        <h1 className="writing-detail-title">{w.title}</h1>
        {w.titleEn && <p className="writing-detail-title-en">{w.titleEn}</p>}

        <div className="writing-detail-divider" />

        <div className="writing-detail-body">
          {w.content.map((para, i) => (
            <p key={i} className="writing-para">
              {para}
            </p>
          ))}
        </div>

        {w.tags.length > 0 && (
          <div className="writing-detail-tags">
            {w.tags.map((t) => (
              <span key={t} className="writing-tag">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="writing-detail-author">
          <div className="writing-author-line">
            <span className="writing-author-label">Written by</span>
            <span className="writing-author-name">Dr. Praduman Khachar</span>
          </div>
          <p className="writing-author-desc">
            Historian, author, and scholar specialising in Saurashtra, Kathiyawad, and Kathi culture.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────────
export default function WritingsPage() {
  usePageTitle("Writings");
  const headerRef = useReveal();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [langFilter, setLangFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [openWriting, setOpenWriting] = useState<Writing | null>(null);

  const filtered = useMemo(() => {
    let list = [...WRITINGS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          (w.titleEn || "").toLowerCase().includes(q) ||
          w.excerpt.toLowerCase().includes(q) ||
          w.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (catFilter !== "all") list = list.filter((w) => w.category === catFilter);
    if (langFilter !== "all") list = list.filter((w) => w.lang === langFilter);
    if (sortBy === "date")
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else list.sort((a, b) => a.title.localeCompare(b.title, "gu"));
    return list;
  }, [search, catFilter, langFilter, sortBy]);

  const usedCats = useMemo(
    () => [...new Set(WRITINGS.map((w) => w.category))],
    []
  );

  return (
    <>
      {openWriting && (
        <WritingDetail w={openWriting} onClose={() => setOpenWriting(null)} />
      )}

      <PageHeader
        ref={headerRef}
        eyebrow="Writings"
        title="विचार — Vichaar"
        subtitle="Original essays, research notes, and historical reflections — authored by Dr. Praduman Khachar."
      />

      <div className="writings-page section-pad">
        {/* Controls */}
        <div className="articles-controls">
          <input
            className="articles-search"
            type="search"
            placeholder="Search by title, keyword, or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search writings"
            id="writings-search"
          />
          <div className="articles-filters">
            <select
              className="articles-select"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              aria-label="Filter by category"
              id="writings-cat-filter"
            >
              <option value="all">All Categories</option>
              {usedCats.map((c) => (
                <option key={c} value={c}>
                  {WRITING_CATEGORIES[c]?.label || c}
                </option>
              ))}
            </select>
            <select
              className="articles-select"
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              aria-label="Filter by language"
              id="writings-lang-filter"
            >
              <option value="all">All Languages</option>
              <option value="gu">Gujarati</option>
              <option value="hi">Hindi</option>
              <option value="en">English</option>
            </select>
            <select
              className="articles-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "title")}
              aria-label="Sort writings"
              id="writings-sort"
            >
              <option value="date">Newest first</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </div>
        </div>

        <p className="articles-results-count">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} of writing
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="writings-grid">
            {filtered.map((w) => (
              <WritingCard key={w.id} w={w} onOpen={setOpenWriting} />
            ))}
          </div>
        ) : (
          <div className="articles-empty">
            <div className="articles-empty-icon">✍️</div>
            <h2>No Writings Found</h2>
            <p>
              Try adjusting your search or filters. More articles will be added
              as Dr. Khachar publishes new research.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
