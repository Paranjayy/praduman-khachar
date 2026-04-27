import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { WRITINGS, WRITING_CATEGORIES } from "../data/writings";

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
  comments: string | null;
  tags: string[];
  category: string | null;
  transcriptLang: string | null;
  transcriptWordCount: number;
  readMinutes: number;
  transcript: string;
  url: string;
}

type UnifiedItem = {
  id: string;
  type: "video" | "writing";
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  thumbnail?: string;
  words?: number;
  views?: string;
  category?: string;
  lang?: string;
  transcriptSnippet?: string; // Matched transcript excerpt
};

// ─── Data loader ──────────────────────────────────────────────────────────────
let _cachedVideos: VideoArticle[] | null = null;
async function loadVideos(): Promise<VideoArticle[]> {
  if (_cachedVideos) return _cachedVideos;
  try {
    const res = await fetch("/data/videos.json");
    if (!res.ok) return [];
    const data = await res.json();
    _cachedVideos = data.videos || [];
    return _cachedVideos!;
  } catch {
    return [];
  }
}

function relativeDate(iso: string) {
  if (!iso || iso.startsWith("NA")) return "Unknown Date";
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (isNaN(days) || days < 0) return "Unknown Date";
  if (days < 1) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// ─── Full-text transcript snippet extractor ───────────────────────────────────
function findTranscriptSnippet(transcript: string, query: string, contextChars = 120): string | null {
  if (!transcript || !query.trim()) return null;
  const idx = transcript.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return null;
  const start = Math.max(0, idx - contextChars / 2);
  const end = Math.min(transcript.length, idx + query.length + contextChars / 2);
  let snippet = transcript.slice(start, end).trim();
  if (start > 0) snippet = "…" + snippet;
  if (end < transcript.length) snippet = snippet + "…";
  return snippet;
}

export default function ExplorePage() {
  usePageTitle("Explore");
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoArticle[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "writing">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table" | "compact">("grid");
  const [sortBy, setSortBy] = useState<"date" | "title" | "words" | "views">("date");
  const [searchInTranscripts, setSearchInTranscripts] = useState(true);

  useEffect(() => {
    loadVideos().then(v => {
      setVideos(v);
      setLoaded(true);
    });
  }, []);

  const items: UnifiedItem[] = useMemo(() => {
    const writingsMapped: UnifiedItem[] = WRITINGS.map(w => ({
      id: w.id,
      type: "writing",
      title: w.title,
      description: w.excerpt,
      date: w.date,
      tags: w.tags,
      slug: `/writings/${w.id}`,
      category: WRITING_CATEGORIES[w.category]?.label || w.category,
      words: w.content.join(" ").split(/\s+/).length,
      lang: w.lang,
    }));

    const videosMapped: UnifiedItem[] = videos.map(v => ({
      id: v.id,
      type: "video",
      title: v.title,
      description: v.description,
      date: v.publishedAt,
      tags: v.tags,
      slug: `/articles/${v.slug && v.slug !== "-" ? v.slug : v.id}`,
      thumbnail: v.thumbnailMq,
      words: v.transcriptWordCount,
      views: v.views || undefined,
      lang: v.transcriptLang || "auto",
    }));

    return [...writingsMapped, ...videosMapped];
  }, [videos]);

  const filteredItems = useMemo(() => {
    let list = items;
    if (typeFilter !== "all") {
      list = list.filter(item => item.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list
        .map(item => {
          // Title/tag/desc match — highest priority
          const titleMatch = item.title.toLowerCase().includes(q);
          const tagMatch = item.tags.some(t => t.toLowerCase().includes(q));
          const descMatch = item.description.toLowerCase().includes(q);

          // Full-text transcript search
          let transcriptSnippet: string | undefined;
          if (searchInTranscripts && item.type === "video") {
            const vid = videos.find(v => v.id === item.id);
            if (vid?.transcript) {
              const snippet = findTranscriptSnippet(vid.transcript, q);
              if (snippet) transcriptSnippet = snippet;
            }
          }

          const matches = titleMatch || tagMatch || descMatch || !!transcriptSnippet;
          if (!matches) return null;
          return { ...item, transcriptSnippet };
        })
        .filter(Boolean) as UnifiedItem[];
    }

    list.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "words") return (b.words || 0) - (a.words || 0);
      if (sortBy === "views") {
        const av = parseInt((a.views || "0").replace(/\D/g, "")) || 0;
        const bv = parseInt((b.views || "0").replace(/\D/g, "")) || 0;
        return bv - av;
      }
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });

    return list;
  }, [items, search, typeFilter, sortBy, searchInTranscripts, videos]);

  const transcriptMatches = filteredItems.filter(i => i.transcriptSnippet).length;
  const totalVideos = items.filter(i => i.type === "video").length;
  const transcriptSearchable = videos.filter(v => v.transcript && v.transcript.length > 100).length;

  return (
    <>
      <PageHeader
        label="Explore Knowledge"
        title="Search All Content"
        subtitle={`${totalVideos} videos · ${WRITINGS.length} writings · ${transcriptSearchable} transcripts searchable`}
      />

      <main className="section explore-page">
        {/* Search bar */}
        <div className="explore-search-wrap">
          <input
            className="articles-search"
            type="search"
            placeholder={searchInTranscripts
              ? "Search titles, tags, descriptions, and transcripts…"
              : "Search titles, tags, and descriptions…"}
            value={search}
            onChange={e => { setSearch(e.target.value); track("explore_search", { q: e.target.value.slice(0, 30) }); }}
            autoFocus
          />
          {search && (
            <p className="explore-search-meta">
              Found <strong>{filteredItems.length}</strong> results
              {transcriptMatches > 0 && <> · <strong>{transcriptMatches}</strong> matched inside transcripts</>}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="articles-controls" style={{ marginBottom: "var(--space-xl)" }}>
          <div className="articles-filters">
            <select className="articles-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
              <option value="all">All Types</option>
              <option value="video">Video Articles ({items.filter(i=>i.type==="video").length})</option>
              <option value="writing">Authored Writings ({items.filter(i=>i.type==="writing").length})</option>
            </select>
            <select className="articles-select" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="date">Newest First</option>
              <option value="words">Most Words</option>
              <option value="views">Most Viewed</option>
              <option value="title">A → Z</option>
            </select>

            {/* Full-text search toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--c-ink-muted)", cursor: "pointer", whiteSpace: "nowrap" }}>
              <input
                type="checkbox"
                checked={searchInTranscripts}
                onChange={e => setSearchInTranscripts(e.target.checked)}
                style={{ accentColor: "var(--c-terracotta)" }}
              />
              Search transcripts
            </label>

            <div className="explore-view-toggles">
              {(["grid", "compact", "table"] as const).map(mode => (
                <button
                  key={mode}
                  className={`view-toggle ${viewMode === mode ? 'active' : ''}`}
                  onClick={() => setViewMode(mode)}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} View`}
                >
                  {mode === "grid" ? "⊞" : mode === "compact" ? "☰" : "⊟"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!loaded ? (
          <div className="articles-loading"><div className="articles-loading-spinner" /><p>Loading content…</p></div>
        ) : filteredItems.length === 0 ? (
          <div className="articles-empty">
            <h2>No content found</h2>
            <p style={{ color: "var(--c-ink-muted)", marginTop: "8px" }}>
              {search ? `No results for "${search}". Try different keywords.` : "Nothing here yet."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="explore-grid">
            {filteredItems.map(item => (
              <Link to={item.slug} key={`${item.type}-${item.id}`} className="explore-card"
                onClick={() => track("explore_click", { type: item.type, id: item.id })}>
                {item.thumbnail ? (
                  <div className="explore-card-thumb">
                    <img src={item.thumbnail} alt={item.title} loading="lazy" />
                  </div>
                ) : (
                  <div className="explore-card-thumb no-thumb">
                    <span className="no-thumb-icon">✍️</span>
                  </div>
                )}
                <div className="explore-card-content">
                  <div className="explore-card-meta">
                    <span className={`explore-type-badge ${item.type}`}>{item.type === "video" ? "🎥 Video" : "✍️ Writing"}</span>
                    {item.date && <time className="explore-date">{relativeDate(item.date)}</time>}
                  </div>
                  <h3 className="explore-card-title">{item.title}</h3>
                  {item.transcriptSnippet ? (
                    <p className="transcript-snippet">{item.transcriptSnippet}</p>
                  ) : (
                    <p className="explore-card-desc">{item.description.slice(0, 100)}…</p>
                  )}
                  <div className="explore-card-footer">
                    {item.words && item.words > 0 && <span className="explore-stat">{item.words.toLocaleString()} words</span>}
                    {item.views && <span className="explore-stat">👁 {item.views}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : viewMode === "compact" ? (
          // Compact list view — like Notion list
          <div className="explore-compact-list">
            {filteredItems.map(item => (
              <Link to={item.slug} key={`${item.type}-${item.id}`} className="explore-compact-item"
                onClick={() => track("explore_click", { type: item.type, id: item.id })}>
                <span className={`explore-type-badge ${item.type}`}>{item.type === "video" ? "🎥" : "✍️"}</span>
                <div className="explore-compact-body">
                  <span className="explore-compact-title">{item.title}</span>
                  {item.transcriptSnippet && (
                    <span className="transcript-snippet" style={{ display: "block", marginTop: "4px" }}>
                      {item.transcriptSnippet}
                    </span>
                  )}
                </div>
                <div className="explore-compact-meta">
                  {item.words && item.words > 0 && <span>{item.words.toLocaleString()}w</span>}
                  <span>{relativeDate(item.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="explore-table-wrap">
            <table className="explore-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Words</th>
                  <th>Views</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={`${item.type}-${item.id}`} onClick={() => navigate(item.slug)} className="explore-table-row">
                    <td><span className={`explore-type-badge ${item.type}`}>{item.type === "video" ? "🎥 Video" : "✍️ Writing"}</span></td>
                    <td className="explore-table-title">
                      {item.title}
                      {item.transcriptSnippet && (
                        <p className="transcript-snippet" style={{ marginTop: "4px" }}>{item.transcriptSnippet}</p>
                      )}
                    </td>
                    <td>{relativeDate(item.date)}</td>
                    <td>{item.words ? item.words.toLocaleString() : "—"}</td>
                    <td>{item.views || "—"}</td>
                    <td>
                      <div className="explore-table-tags">
                        {item.tags.slice(0, 2).map(t => <span key={t} className="explore-tag">{t}</span>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
