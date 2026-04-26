import { useState, useMemo, useEffect } from "react";
import { track } from "@vercel/analytics";
import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";

// ─── Types ──────────────────────────────────────────────────────────────────
interface VideoArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailMq: string;
  publishedAt: string;
  views: string | null;
  likes: string | null;
  tags: string[];
  category: string | null;
  transcriptLang: string | null;
  transcriptWordCount: number;
  readMinutes: number;
  transcript: string;
  url: string;
}

interface VideosJson {
  scraped_at: string;
  total: number;
  transcript_ok: number;
  transcript_fail: number;
  videos: VideoArticle[];
}

// ─── Load the scraped JSON via fetch (graceful if file doesn't exist yet) ──
let cachedData: VideosJson | null = null;

async function loadVideos(): Promise<VideosJson | null> {
  if (cachedData) return cachedData;
  try {
    // videos.json is placed in /public/data/ by the scraper for runtime fetch
    const res = await fetch("/data/videos.json");
    if (!res.ok) return null;
    cachedData = await res.json();
    return cachedData;
  } catch {
    return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function relativeDate(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function langLabel(lang: string | null) {
  if (!lang) return null;
  if (lang === "hi") return "हिन्दी";
  if (lang === "gu") return "ગુજરાતી";
  if (lang === "en" || lang === "en-IN") return "English";
  if (lang === "auto") return "Auto";
  return lang;
}

// ─── Components ───────────────────────────────────────────────────────────────
function ArticleCard({ v, index }: { v: VideoArticle; index: number }) {
  const [ref, visible] = useReveal();

  return (
    <article
      ref={ref}
      className="article-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ${(index % 6) * 0.07}s ease`,
      }}
    >
      {/* Thumbnail */}
      <a
        href={v.url}
        target="_blank"
        rel="noopener noreferrer"
        className="article-thumb-link"
        onClick={() => track("article_click", { videoId: v.id, title: v.title.slice(0, 50) })}
      >
        <div className="article-thumb">
          <img
            src={v.thumbnailMq}
            alt={v.title}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = v.thumbnail;
            }}
          />
          <span className="article-thumb-play">▶</span>
          <span className="article-thumb-duration">{v.readMinutes} min read</span>
        </div>
      </a>

      {/* Content */}
      <div className="article-content">
        {/* Meta row */}
        <div className="article-meta">
          {v.publishedAt && (
            <time className="article-date">{relativeDate(v.publishedAt)}</time>
          )}
          {v.transcriptWordCount > 0 && (
            <span className="article-transcript-badge" title="Transcript available">
              📝 {langLabel(v.transcriptLang)}
            </span>
          )}
          {v.views && <span className="article-views">👁 {v.views}</span>}
        </div>

        {/* Title */}
        <h3 className="article-title">
          <a
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("article_click", { videoId: v.id, title: v.title.slice(0, 50) })}
          >
            {v.title}
          </a>
        </h3>

        {/* Description */}
        {v.description && (
          <p className="article-desc">{v.description.slice(0, 160)}…</p>
        )}

        {/* Tags */}
        {v.tags && v.tags.length > 0 && (
          <div className="article-tags">
            {v.tags.slice(0, 4).map((t) => (
              <span key={t} className="article-tag">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="article-footer">
          <a
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="article-watch-link"
            onClick={() => track("article_watch", { videoId: v.id })}
          >
            Watch on YouTube ↗
          </a>
          {v.transcriptWordCount > 0 && (
            <span className="article-word-count">
              {v.transcriptWordCount.toLocaleString()} words
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="articles-empty">
      <div className="articles-empty-icon">📜</div>
      <h2>Articles Not Yet Generated</h2>
      <p>
        Run the scraper to pull videos and transcripts from YouTube, then this
        page will populate automatically.
      </p>
      <div className="articles-empty-code">
        <code>npm run scrape:videos:test</code>
        <span>— test with 5 videos first</span>
      </div>
      <div className="articles-empty-code">
        <code>npm run scrape:videos</code>
        <span>— full channel scrape (~45 min)</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ArticlesPage() {
  const [videos, setVideos] = useState<VideoArticle[] | null>(null);
  const [meta, setMeta] = useState<Omit<VideosJson, "videos"> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "words" | "views">("date");

  // Load on mount
  useEffect(() => {
    loadVideos().then((data) => {
      if (data) {
        setVideos(data.videos);
        setMeta({ scraped_at: data.scraped_at, total: data.total, transcript_ok: data.transcript_ok, transcript_fail: data.transcript_fail });
      }
      setLoaded(true);
    });
  }, []);

  // Derived lists
  const langs = useMemo(() => {
    if (!videos) return [];
    const s = new Set(videos.map((v) => v.transcriptLang).filter(Boolean));
    return Array.from(s) as string[];
  }, [videos]);

  const filtered = useMemo(() => {
    if (!videos) return [];
    let list = [...videos];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description?.toLowerCase().includes(q) ||
          v.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (langFilter !== "all") {
      list = list.filter((v) => v.transcriptLang === langFilter);
    }
    if (sortBy === "words") list.sort((a, b) => b.transcriptWordCount - a.transcriptWordCount);
    else if (sortBy === "views")
      list.sort((a, b) => {
        const av = parseInt((a.views || "0").replace(/\D/g, ""));
        const bv = parseInt((b.views || "0").replace(/\D/g, ""));
        return bv - av;
      });
    else list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return list;
  }, [videos, search, langFilter, sortBy]);

  return (
    <>
      <PageHeader
        label="Video Articles"
        title="History in Every Frame"
        subtitle="Every lecture, documentary, and discussion — now searchable, readable, and transcribed."
        dark
      />

      <main className="section articles-page">
        {/* Metadata strip */}
        {meta && (
          <div className="articles-meta-strip">
            <span>{meta.total} videos indexed</span>
            <span>·</span>
            <span>{meta.transcript_ok} transcripts available</span>
            <span>·</span>
            <span>Updated {relativeDate(meta.scraped_at)}</span>
          </div>
        )}

        {/* Controls */}
        {videos && videos.length > 0 && (
          <div className="articles-controls">
            <input
              type="search"
              className="articles-search"
              placeholder="Search titles, tags, descriptions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search articles"
            />
            <div className="articles-filters">
              <select
                className="articles-select"
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                aria-label="Filter by language"
              >
                <option value="all">All Languages</option>
                {langs.map((l) => (
                  <option key={l} value={l}>
                    {langLabel(l)}
                  </option>
                ))}
              </select>
              <select
                className="articles-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort by"
              >
                <option value="date">Newest First</option>
                <option value="words">Most Words</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        )}

        {/* Results count */}
        {search && (
          <p className="articles-results-count">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
          </p>
        )}

        {/* Grid or empty state */}
        {!loaded ? (
          <div className="articles-loading">
            <div className="articles-loading-spinner" />
            <p>Loading articles…</p>
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="articles-grid">
            {filtered.map((v, i) => (
              <ArticleCard key={v.id} v={v} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </>
  );
}
