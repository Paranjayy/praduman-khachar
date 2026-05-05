/**
 * src/pages/Writings.tsx
 *
 * /writings         — grid of all writing cards
 * /writings/:slug   — full article page with sticky TOC sidebar
 *
 * No popup/overlay — proper routes. Professional, scholarly layout.
 */

import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { WRITINGS, WRITING_CATEGORIES, type Writing } from "../data/writings";

// ─── TOC builder ──────────────────────────────────────────────────────────────
function buildTOC(content: string[]) {
  return content.map((para, i) => ({
    id: `para-${i}`,
    label: para.slice(0, 55).replace(/[#*_]/g, "").trim() + (para.length > 55 ? "…" : ""),
    index: i,
  }));
}

// ─── Article Page (slug route) ────────────────────────────────────────────────
function WritingArticlePage({ writing }: { writing: Writing }) {
  usePageTitle(writing.titleEn || writing.title);
  const toc = useMemo(() => buildTOC(writing.content), [writing.content]);
  const [activeId, setActiveId] = useState("para-0");
  const articleRef = useRef<HTMLDivElement>(null);
  const cat = WRITING_CATEGORIES[writing.category];
  const wordCount = writing.content.join(" ").split(/\s+/).length;
  const readMin = Math.max(1, Math.ceil(wordCount / 200));
  const dateStr = new Date(writing.date).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  // Intersection observer for active TOC item
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    articleRef.current?.querySelectorAll("[data-para]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [writing]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="writing-article-page">
      {/* Back nav */}
      <div className="writing-breadcrumb">
        <Link to="/writings" className="writing-back-link">← All Writings</Link>
        <span className="writing-breadcrumb-sep">/</span>
        <span className="writing-breadcrumb-current">{writing.titleEn || writing.title}</span>
      </div>

      <div className="writing-article-layout">
        {/* ── LEFT: TOC sidebar ── */}
        {toc.length > 1 && (
          <aside className="writing-toc">
            <div className="writing-toc-header">
              <span className="writing-toc-label">Contents</span>
              <span className="writing-toc-count">{toc.length} sections</span>
            </div>
            <nav>
              <ol className="writing-toc-list">
                {toc.map((item, i) => (
                  <li key={item.id}>
                    <button
                      className={`writing-toc-item${activeId === item.id ? " active" : ""}`}
                      onClick={() => scrollTo(item.id)}
                    >
                      <span className="writing-toc-num">{i + 1}</span>
                      <span className="writing-toc-text">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            {/* Progress bar */}
            <div className="writing-toc-footer">
              <span className="writing-toc-stat">~{readMin} min read</span>
              <span className="writing-toc-stat">{wordCount.toLocaleString()} words</span>
            </div>
          </aside>
        )}

        {/* ── RIGHT: Article content ── */}
        <article className="writing-article-body" ref={articleRef}>
          {/* Header */}
          <header className="writing-article-header">
            <div className="writing-article-meta">
              <span
                className="writing-cat-pill"
                style={{ color: cat?.color || "var(--c-terracotta)" }}
              >
                {cat?.label || writing.category}
              </span>
              {cat?.labelGu && <span className="writing-cat-gu">{cat.labelGu}</span>}
              <time className="writing-date">{dateStr}</time>
              <span className="writing-lang-pill">{writing.lang.toUpperCase()}</span>
            </div>

            <h1 className="writing-article-title">{writing.title}</h1>
            {writing.titleEn && (
              <p className="writing-article-title-en">{writing.titleEn}</p>
            )}

            <p className="writing-article-excerpt">{writing.excerpt}</p>

          </header>
          {writing.imageUrl && (
            <img src={writing.imageUrl} alt={writing.title} className="writing-header-img" />
          )}

          {/* Content */}
          <div className="writing-article-content">
            {writing.content.map((para, i) => {
              if (para.startsWith("[img:") && para.endsWith("]")) {
                const url = para.slice(5, -1);
                return (
                  <div key={i} className="writing-inline-img-wrap" style={{ margin: '2.5rem 0' }}>
                    <img src={url} alt="Article Content" style={{ width: '100%', borderRadius: '12px' }} />
                  </div>
                );
              }
              return (
                <p
                  key={i}
                  id={`para-${i}`}
                  data-para={i}
                  className="writing-article-para"
                >
                  {para}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {writing.tags.length > 0 && (
            <div className="writing-article-tags">
              {writing.tags.map(t => (
                <span key={t} className="writing-tag">{t}</span>
              ))}
            </div>
          )}

          {/* Author card */}
          <div className="writing-article-author">
            <div className="writing-author-avatar">ડૉ</div>
            <div>
              <div className="writing-author-name">Dr. Praduman Khachar</div>
              <div className="writing-author-role">
                Historian · Author · Professor · YouTuber
              </div>
              <p className="writing-author-bio">
                Scholar specialising in Saurashtra, Kathiyawad, and Kathi culture.
                Author of 33+ books on Gujarati history and heritage.
              </p>
            </div>
          </div>

          {/* Next/prev navigation */}
          <WritingNav current={writing} />
        </article>
      </div>
    </div>
  );
}

// ─── Next/Prev nav ────────────────────────────────────────────────────────────
function WritingNav({ current }: { current: Writing }) {
  const idx = WRITINGS.findIndex(w => w.id === current.id);
  const prev = WRITINGS[idx - 1];
  const next = WRITINGS[idx + 1];
  if (!prev && !next) return null;
  return (
    <nav className="writing-nav">
      {prev ? (
        <Link to={`/writings/${prev.id}`} className="writing-nav-link writing-nav-prev">
          <span className="writing-nav-dir">← Previous</span>
          <span className="writing-nav-title">{prev.title}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={`/writings/${next.id}`} className="writing-nav-link writing-nav-next">
          <span className="writing-nav-dir">Next →</span>
          <span className="writing-nav-title">{next.title}</span>
        </Link>
      ) : <span />}
    </nav>
  );
}

// ─── Writing Card (in grid) ───────────────────────────────────────────────────
function WritingCard({ w }: { w: Writing }) {
  const [ref, visible] = useReveal();
  const cat = WRITING_CATEGORIES[w.category];
  const dateStr = new Date(w.date).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <article
      ref={ref}
      className="writing-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s ease",
      }}
    >
      {w.imageUrl && (
        <img src={w.imageUrl} alt={w.title} className="writing-card-img" />
      )}
      <div className="writing-card-content" style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flex: 1 }}>
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
          {w.tags.slice(0, 5).map(t => <span key={t} className="writing-tag">{t}</span>)}
        </div>
        <div className="writing-card-footer">
          <Link
            to={`/writings/${w.id}`}
            className="writing-read-cta"
            onClick={() => track("writing_open", { id: w.id })}
          >
            Read article →
          </Link>
          {w.featured && <span className="writing-featured-badge">Featured</span>}
        </div>
      </div>
    </article>
  );
}

// ─── Writings Grid Page ────────────────────────────────────────────────────────
function WritingsGrid() {
  usePageTitle("Writings");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [langFilter, setLangFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const filtered = useMemo(() => {
    let list = WRITINGS.filter(w => !w.hidden);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(w =>
        w.title.toLowerCase().includes(q) ||
        (w.titleEn || "").toLowerCase().includes(q) ||
        w.excerpt.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (catFilter !== "all") list = list.filter(w => w.category === catFilter);
    if (langFilter !== "all") list = list.filter(w => w.lang === langFilter);
    list.sort(sortBy === "date"
      ? (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      : (a, b) => a.title.localeCompare(b.title, "gu")
    );
    return list;
  }, [search, catFilter, langFilter, sortBy]);

  const usedCats = useMemo(() => [...new Set(WRITINGS.map(w => w.category))], []);

  return (
    <>
      <PageHeader
        eyebrow="Writings"
        title="विचार — Vichaar"
        subtitle="Original essays, research notes, and historical reflections — authored by Dr. Praduman Khachar."
      />

      <div className="writings-page section-pad">
        <div className="articles-controls">
          <input
            className="articles-search"
            type="search"
            placeholder="Search by title, keyword, or tag…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search writings"
            id="writings-search"
          />
          <div className="articles-filters">
            <select className="articles-select" value={catFilter} onChange={e => setCatFilter(e.target.value)} id="writings-cat-filter">
              <option value="all">All Categories</option>
              {usedCats.map(c => (
                <option key={c} value={c}>{WRITING_CATEGORIES[c]?.label || c}</option>
              ))}
            </select>
            <select className="articles-select" value={langFilter} onChange={e => setLangFilter(e.target.value)} id="writings-lang-filter">
              <option value="all">All Languages</option>
              <option value="gu">Gujarati</option>
              <option value="hi">Hindi</option>
              <option value="en">English</option>
            </select>
            <select className="articles-select" value={sortBy} onChange={e => setSortBy(e.target.value as "date" | "title")} id="writings-sort">
              <option value="date">Newest first</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </div>
        </div>

        <p className="articles-results-count">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} of writing
        </p>

        {filtered.length > 0 ? (
          <div className="writings-grid">
            {filtered.map(w => <WritingCard key={w.id} w={w} />)}
          </div>
        ) : (
          <div className="articles-empty">
            <div className="articles-empty-icon">✍️</div>
            <h2>No Writings Found</h2>
            <p>Try adjusting your filters. More articles will be added as Dr. Khachar publishes new research.</p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── 404 Redirect (proper hooks-compliant component) ─────────────────────────
function WritingsRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/writings", { replace: true }); }, [navigate]);
  return null;
}

// ─── Router wrapper ───────────────────────────────────────────────────────────
export default function WritingsPage() {
  const { slug } = useParams<{ slug?: string }>();

  if (slug) {
    const writing = WRITINGS.find(w => w.id === slug);
    if (!writing) return <WritingsRedirect />;
    return <WritingArticlePage writing={writing} />;
  }

  return <WritingsGrid />;
}
