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
};

// ─── Data loader ──────────────────────────────────────────────────────────────
let cachedData: any = null;
async function loadVideos(): Promise<VideoArticle[]> {
  if (cachedData) return cachedData;
  try {
    const res = await fetch("/data/videos.json");
    if (!res.ok) return [];
    const data = await res.json();
    cachedData = data.videos || [];
    return cachedData;
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

export default function ExplorePage() {
  usePageTitle("Explore");
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoArticle[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "writing">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<"date" | "title" | "words">("date");

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
      slug: `/articles/${v.slug || v.id}`,
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
      const q = search.toLowerCase();
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) || 
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "words") return (b.words || 0) - (a.words || 0);
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });

    return list;
  }, [items, search, typeFilter, sortBy]);

  return (
    <>
      <PageHeader
        label="Explore Knowledge"
        title="Unified Library"
        subtitle="Search and filter through all video transcripts and authored writings in one place."
      />

      <main className="section explore-page">
        <div className="articles-controls">
          <input
            className="articles-search"
            type="search"
            placeholder="Search all content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="articles-filters">
            <select className="articles-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
              <option value="all">All Types</option>
              <option value="video">Video Articles</option>
              <option value="writing">Authored Writings</option>
            </select>
            <select className="articles-select" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="date">Newest</option>
              <option value="words">Most Words</option>
              <option value="title">A-Z</option>
            </select>
            <div className="explore-view-toggles">
              <button 
                className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button 
                className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {!loaded ? (
          <div className="articles-loading"><div className="articles-loading-spinner" /></div>
        ) : filteredItems.length === 0 ? (
          <div className="articles-empty">
            <h2>No content found</h2>
          </div>
        ) : viewMode === "grid" ? (
          <div className="explore-grid">
            {filteredItems.map(item => (
              <Link to={item.slug} key={`${item.type}-${item.id}`} className="explore-card">
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
                    <span className={`explore-type-badge ${item.type}`}>{item.type === "video" ? "Video" : "Writing"}</span>
                    {item.date && <time className="explore-date">{relativeDate(item.date)}</time>}
                  </div>
                  <h3 className="explore-card-title">{item.title}</h3>
                  <p className="explore-card-desc">{item.description.slice(0, 100)}...</p>
                  <div className="explore-card-footer">
                    {item.words && <span className="explore-stat">{item.words.toLocaleString()} words</span>}
                  </div>
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
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={`${item.type}-${item.id}`} onClick={() => navigate(item.slug)} className="explore-table-row">
                    <td><span className={`explore-type-badge ${item.type}`}>{item.type === "video" ? "🎥 Video" : "✍️ Writing"}</span></td>
                    <td className="explore-table-title">{item.title}</td>
                    <td>{relativeDate(item.date)}</td>
                    <td>{item.words ? item.words.toLocaleString() : "-"}</td>
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
