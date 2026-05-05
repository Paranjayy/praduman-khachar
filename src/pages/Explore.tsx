import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { WRITINGS, WRITING_CATEGORIES } from "../data/writings";
import { CONFIG } from "../config";
import { QuicklookPortal } from "../components/QuicklookPortal";
import { Eye, Search, X } from "lucide-react";

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

interface QuicklookProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemId?: string;
  type?: 'video' | 'writing';
  image?: string;
  videoUrl?: string;
  figures?: string[];
  description?: string;
  onPrev?: () => void;
  onNext?: () => void;
  metadata?: {
    format?: string;
    size?: string;
    date?: string;
  };
}

interface UnifiedItem {
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
  transcriptSnippet?: string;
  url?: string;
  score?: number;
}

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
  } catch (err) {
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

// ─── MyMemory Translation (free, no key needed for modest use) ─────────────────
async function translateQuery(text: string, targetLang: 'gu' | 'hi'): Promise<string> {
  try {
    const src = 'en';
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${targetLang}`
    );
    const data = await res.json();
    return (data.responseData as any)?.translatedText || text;
  } catch (err) {
    return text;
  }
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
  
  // Highlight the query
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  snippet = snippet.replace(regex, '<mark>$1</mark>');
  
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
  // Translated query for cross-lingual search
  const [translatedQuery, setTranslatedQuery] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Tina Hover Preview State
  const [hoveredThumb, setHoveredThumb] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Quicklook State
  const [quicklookItem, setQuicklookItem] = useState<UnifiedItem | null>(null);

  const handleQuicklook = (e: React.MouseEvent, item: UnifiedItem) => {
    e.preventDefault();
    e.stopPropagation();
    setQuicklookItem(item);
  };

  const handleNext = () => {
    if (!quicklookItem) return;
    const idx = filteredItems.findIndex(i => i.id === quicklookItem.id);
    if (idx < filteredItems.length - 1) {
      setQuicklookItem(filteredItems[idx + 1]);
    }
  };

  const handlePrev = () => {
    if (!quicklookItem) return;
    const idx = filteredItems.findIndex(i => i.id === quicklookItem.id);
    if (idx > 0) {
      setQuicklookItem(filteredItems[idx - 1]);
    }
  };

  // CMS Hide Logic
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("archival_hidden_ids");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdmin] = useState(() => localStorage.getItem("is_admin") === "true");

  const toggleHide = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newHidden = hiddenIds.includes(id) 
      ? hiddenIds.filter(i => i !== id)
      : [...hiddenIds, id];
    setHiddenIds(newHidden);
    localStorage.setItem("archival_hidden_ids", JSON.stringify(newHidden));
  };

  // Auto-translate English queries to Gujarati for cross-lingual matching
  const isLikelyEnglish = (q: string) => /^[a-zA-Z\s]+$/.test(q) && q.trim().length > 2;

  useEffect(() => {
    if (!search.trim() || !searchInTranscripts) { setTranslatedQuery(""); return; }
    if (!isLikelyEnglish(search)) { setTranslatedQuery(""); return; }
    const timer = setTimeout(async () => {
      setIsTranslating(true);
      const guQuery = await translateQuery(search.trim(), 'gu');
      setTranslatedQuery(guQuery !== search.trim() ? guQuery : "");
      setIsTranslating(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [search, searchInTranscripts]);

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
      category: WRITING_CATEGORIES[w.category as keyof typeof WRITING_CATEGORIES]?.label || w.category,
      words: w.content.join(" ").split(/\s+/).length,
      lang: w.lang,
    }));

    const videosMapped: UnifiedItem[] = videos.map(v => ({
      id: v.id,
      type: "video",
      title: v.title,
      description: v.description,
      date: v.publishedAt,
      tags: v.tags || [],
      slug: `/articles/${v.slug && v.slug !== "-" ? v.slug : v.id}`,
      thumbnail: v.thumbnailMq,
      words: v.transcriptWordCount,
      views: v.views || undefined,
      lang: v.transcriptLang || "auto",
      url: v.url,
    }));

    return [...writingsMapped, ...videosMapped];
  }, [videos]);

  const filteredItems = useMemo(() => {
    let list = items;
    
    // Filter hidden items unless in admin mode
    if (!isAdmin) {
      list = list.filter(item => !hiddenIds.includes(item.id));
    }

    if (typeFilter !== "all") {
      list = list.filter(i => i.type === typeFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const tq = translatedQuery.toLowerCase();

      return (list
        .map(item => {
          let score = 0;
          const title = item.title.toLowerCase();
          const desc = item.description.toLowerCase();
          const tags = item.tags.map(t => t.toLowerCase());

          // Title Match (Highest weight)
          if (title.includes(q)) score += 100;
          else if (q.split(/\s+/).every(w => title.includes(w))) score += 70; // All words match
          
          if (tq && title.includes(tq)) score += 80;

          // Tags Match
          tags.forEach(t => { 
            if (t === q) score += 50;
            else if (t.includes(q)) score += 20; 
          });

          // Description Match
          if (desc.includes(q)) score += 30;

          // Transcript Match (Cross-lingual support)
          let transcriptSnippet: string | undefined;
          if (searchInTranscripts && item.type === "video") {
            const vid = videos.find(v => v.id === item.id);
            if (vid?.transcript) {
              let snippet = findTranscriptSnippet(vid.transcript, q);
              if (!snippet && tq) {
                snippet = findTranscriptSnippet(vid.transcript, tq);
                if (snippet) snippet = `🌐 Cross-lingual match: ${snippet}`;
              }
              if (snippet) {
                score += 40;
                transcriptSnippet = CONFIG.HIDE_TRANSCRIPTS
                  ? "🧠 AI match found within video context."
                  : snippet;
              }
            }
          }

          if (score === 0) return null;
          return { ...item, score, transcriptSnippet };
        })
        .filter((i: any): i is any => !!i && i.score !== undefined)
        .sort((a: any, b: any) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        }) as any[]) as UnifiedItem[];
    }

    // Default sort if no search
    return ([...list].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title, "gu");
      if (sortBy === "words") return (b.words || 0) - (a.words || 0);
      if (sortBy === "views") {
        const av = parseInt((a.views || "0").replace(/\D/g, "")) || 0;
        const bv = parseInt((b.views || "0").replace(/\D/g, "")) || 0;
        return bv - av;
      }
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    })) as UnifiedItem[];
  }, [items, search, translatedQuery, typeFilter, sortBy, searchInTranscripts, videos]);

  const transcriptMatches = filteredItems.filter(i => !!i.transcriptSnippet).length;
  const totalVideos = items.filter(i => i.type === "video").length;
  const transcriptSearchable = videos.filter(v => v.transcript && v.transcript.length > 100).length;

  return (
    <>
      <PageHeader
        label="Explore Knowledge"
        title="Semantic Archive Search"
        subtitle={`${totalVideos} videos · ${WRITINGS.length} writings · ${transcriptSearchable} transcripts indexed`}
      />

      <main className="section explore-page">
        {/* Search bar */}
        <div className="explore-search-container">
          <div className="explore-search-wrap">
            <div className="explore-engine-badge">
              <span className="pulse-dot"></span>
              Semantic Engine V2
            </div>
            <div className="explore-input-inner">
              <Search className="explore-search-icon" size={20} />
              <input
                className="explore-search-input"
                type="search"
                placeholder={searchInTranscripts
                  ? "Try: 'Saurashtra history', 'ભવનાથ મહાદેવ', or 'INTACH'…"
                  : "Search titles and tags…"}
                value={search}
                onChange={e => { setSearch(e.target.value); (track as any)("explore_search", { q: e.target.value.slice(0, 30) }); }}
                autoFocus
              />
              <div className="explore-search-kb">⌘K</div>
            </div>
            {search && (
              <p className="explore-search-meta">
                Showing <strong>{filteredItems.length}</strong> prioritized results
                {transcriptMatches > 0 && <> · <strong>{transcriptMatches}</strong> matches in transcript</>}
                {isTranslating && <> · <em style={{color:'var(--c-terracotta)'}}>translating…</em></>}
                {translatedQuery && !isTranslating && <> · cross-lingual: <em>{translatedQuery}</em></>}
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="articles-controls" style={{ marginBottom: "var(--space-xl)" }}>
          <div className="articles-filters">
            <select className="articles-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
              <option value="all">All Content</option>
              <option value="video">Lectures & Videos ({items.filter(i=>i.type==="video").length})</option>
              <option value="writing">Articles & Writings ({items.filter(i=>i.type==="writing").length})</option>
            </select>
            <select className="articles-select" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="date">Newest First</option>
              <option value="words">Long Form</option>
              <option value="views">Most Popular</option>
              <option value="title">Alphabetical</option>
            </select>

            <label 
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--c-ink-muted)", cursor: "pointer", whiteSpace: "nowrap" }}
              title={`${transcriptSearchable} out of ${totalVideos} video transcripts are currently long enough (>100 characters) to be indexed for deep search. Short or missing transcripts are excluded for better result quality.`}
            >
              <input
                type="checkbox"
                checked={searchInTranscripts}
                onChange={e => setSearchInTranscripts(e.target.checked)}
                style={{ accentColor: "var(--c-terracotta)" }}
              />
              Deep Search
            </label>

            <div className="explore-view-toggles">
              {(["grid", "compact", "table"] as const).map(mode => (
                <button
                  key={mode}
                  className={`view-toggle ${viewMode === mode ? 'active' : ''}`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode === "grid" ? "⊞" : mode === "compact" ? "☰" : "⊟"}
                </button>
              ))}
            </div>

            {isAdmin && (
              <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--c-terracotta)' }}>
                ADMIN MODE ACTIVE
              </div>
            )}
          </div>
        </div>

        {!loaded ? (
          <div className="explore-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="explore-card skeleton-card">
                <div className="explore-card-thumb skeleton" style={{ height: '200px' }} />
                <div className="explore-card-content">
                  <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '1rem' }} />
                  <div className="skeleton" style={{ height: '24px', width: '90%', marginBottom: '0.8rem' }} />
                  <div className="skeleton" style={{ height: '12px', width: '100%', marginBottom: '0.4rem' }} />
                  <div className="skeleton" style={{ height: '12px', width: '100%', marginBottom: '0.4rem' }} />
                  <div className="skeleton" style={{ height: '12px', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="articles-empty">
            <h2>No matches found</h2>
            <p>Try broader terms or Gujarati keywords.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="explore-grid">
            {filteredItems.map(item => (
              <div key={`${item.type}-${item.id}`} className={`explore-card-container ${hiddenIds.includes(item.id) ? 'is-hidden-admin' : ''}`}>
                <div 
                  className="explore-card" 
                  data-cursor-text={item.type === 'video' ? 'Play' : 'View'}
                  onClick={(e) => item.type === 'video' ? handleQuicklook(e, item) : navigate(item.slug)}
                  style={{ cursor: 'pointer' }}
                >
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
                      <p className="transcript-snippet" dangerouslySetInnerHTML={{ __html: item.transcriptSnippet }} />
                    ) : (
                      <p className="explore-card-desc">{item.description.slice(0, 110)}…</p>
                    )}
                    <div className="explore-card-footer">
                      {item.words && item.words > 0 && <span className="explore-stat">{item.words.toLocaleString()} words</span>}
                      {item.views && <span className="explore-stat">👁 {item.views}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="card-actions-overlay">
                  <button 
                    className="card-quicklook-trigger" 
                    onClick={(e) => handleQuicklook(e, item)}
                    data-cursor-text="Quick Look"
                  >
                    <Eye size={16} />
                  </button>
                  
                  {isAdmin && (
                    <button 
                      className="card-admin-hide-btn"
                      onClick={(e) => toggleHide(e, item.id)}
                      title={hiddenIds.includes(item.id) ? "Show" : "Hide"}
                    >
                      {hiddenIds.includes(item.id) ? "👁️" : "🗑️"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "compact" ? (
          <div className="explore-compact-list">
            {filteredItems.map(item => (
              <Link to={item.slug} key={`${item.type}-${item.id}`} className="explore-compact-item" data-cursor-text="View">
                <span className={`explore-type-badge ${item.type}`}>{item.type === "video" ? "🎥" : "✍️"}</span>
                <div className="explore-compact-body">
                  <span className="explore-compact-title">{item.title}</span>
                  {item.transcriptSnippet && <span className="transcript-snippet" style={{ display: "block", marginTop: "4px" }} dangerouslySetInnerHTML={{ __html: item.transcriptSnippet }} />}
                </div>
                <div className="explore-compact-meta">
                  <button 
                    className="compact-quicklook-trigger" 
                    onClick={(e) => handleQuicklook(e, item)}
                  >
                    <Eye size={14} />
                  </button>
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
                  <th>Stats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr 
                    key={`${item.type}-${item.id}`} 
                    onClick={() => navigate(item.slug)} 
                    className="explore-table-row"
                    onMouseEnter={() => item.thumbnail && setHoveredThumb(item.thumbnail)}
                    onMouseLeave={() => setHoveredThumb(null)}
                    data-cursor-text="Open"
                  >
                    <td><span className={`explore-type-badge ${item.type}`}>{item.type === "video" ? "🎥" : "✍️"}</span></td>
                    <td className="explore-table-title">
                      {item.title}
                      {item.transcriptSnippet && <p className="transcript-snippet" style={{ marginTop: "4px" }} dangerouslySetInnerHTML={{ __html: item.transcriptSnippet }} />}
                    </td>
                    <td>{relativeDate(item.date)}</td>
                    <td>{item.views || (item.words ? `${item.words}w` : "—")}</td>
                    <td>
                      <div className="explore-table-actions">
                        <button 
                          className="table-quicklook-btn"
                          onClick={(e) => handleQuicklook(e, item)}
                          title="Quick Look"
                          data-cursor-text="Quick Look"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {isAdmin && (
                          <button 
                            className="table-admin-hide-btn"
                            onClick={(e) => toggleHide(e, item.id)}
                            title={hiddenIds.includes(item.id) ? "Show" : "Hide"}
                          >
                            {hiddenIds.includes(item.id) ? "👁️" : "🗑️"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tina Hover Preview */}
            <div 
              className={`hover-preview-container ${hoveredThumb ? 'visible' : ''}`}
              style={{ left: mousePos.x, top: mousePos.y }}
            >
              {hoveredThumb && <img src={hoveredThumb} alt="Preview" />}
            </div>
          </div>
        )}

        <QuicklookPortal
          isOpen={!!quicklookItem}
          onClose={() => setQuicklookItem(null)}
          title={quicklookItem?.title || ""}
          itemId={quicklookItem?.id.toUpperCase() || "ARC.001"}
          type={quicklookItem?.type}
          image={quicklookItem?.thumbnail}
          videoUrl={quicklookItem?.url}
          description={quicklookItem?.description}
          transcript={quicklookItem?.type === 'video' ? videos.find(v => v.id === quicklookItem.id)?.transcript : undefined}
          onNext={handleNext}
          onPrev={handlePrev}
          figures={quicklookItem?.type === 'video' ? [
            quicklookItem.thumbnail!,
            "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=300",
            "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=300"
          ] : []}
        />
      </main>
    </>
  );
}
