/**
 * src/pages/Articles.tsx
 *
 * Video Articles page — inline transcript reader
 * Supports /articles/:slug deep-links, share, citation copy, print.
 */

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { CONFIG } from "../config";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TranscriptSegment {
  t: number;   // seconds from start
  text: string;
}

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
  transcriptSegments?: TranscriptSegment[];
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

// ─── Data loader ──────────────────────────────────────────────────────────────
let cachedData: VideosJson | null = null;
async function loadVideos(): Promise<VideosJson | null> {
  if (cachedData) return cachedData;
  try {
    const res = await fetch("/data/videos.json");
    if (!res.ok) return null;
    cachedData = await res.json();
    return cachedData;
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function langLabel(lang: string | null) {
  if (!lang) return null;
  const map: Record<string, string> = { hi: "हिन्दी", gu: "ગુજરાતી", en: "English", "en-IN": "English", auto: "Auto" };
  return map[lang] ?? lang;
}

/**
 * Clean YouTube description — strips the boilerplate social links spam
 */
function cleanDescription(desc: string): string {
  if (!desc) return '';
  // Remove common boilerplate patterns
  return desc
    .replace(/Social Media Links[^\n]*/gi, '')
    .replace(/https?:\/\/[^\s]+/g, '')      // remove all URLs
    .replace(/📷[^\n]*/g, '')                // emoji-prefixed social lines
    .replace(/🕊[^\n]*/g, '')
    .replace(/Telegram[^\n]*/gi, '')
    .replace(/Facebook[^\n]*/gi, '')
    .replace(/Instagram[^\n]*/gi, '')
    .replace(/Twitter[^\n]*/gi, '')
    .replace(/--\|[^\n]*/g, '')              // -- | separators
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Format seconds → MM:SS or H:MM:SS for timestamp display
 */
function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Turn a raw transcript string into readable paragraphs.
 */
function formatTranscript(raw: string): string[] {
  if (!raw) return [];
  // Split into ~sentence chunks, then group into paragraphs of ~5 sentences
  const sentences = raw
    .replace(/([।॥])/g, "$1\n")          // Gujarati/Hindi punctuation
    .replace(/([.!?])\s+(?=[A-ZA-Z\u0A80-\u0AFF\u0900-\u097F])/g, "$1\n")
    .split(/\n+/)
    .map(s => s.trim())
    .filter(Boolean);

  const paras: string[] = [];
  const CHUNK = 5;
  for (let i = 0; i < sentences.length; i += CHUNK) {
    paras.push(sentences.slice(i, i + CHUNK).join(" "));
  }
  return paras.length ? paras : [raw];
}

/**
 * Build TOC: every Nth paragraph becomes a section with an anchor
 */
function buildTOC(paras: string[]) {
  const SECTION_SIZE = 4;
  return paras
    .filter((_, i) => i % SECTION_SIZE === 0)
    .map((p, i) => ({
      id: `section-${i}`,
      label: `Part ${i + 1}`,
      preview: p.slice(0, 60) + "…",
    }));
}

/**
 * Sentence analytics — word count per sentence for sparkline
 */
function computeSentenceStats(text: string) {
  if (!text) return null;
  const sentences = text
    .split(/(?<=[.!?।॥])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 2);
  if (!sentences.length) return null;
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);
  const sample = lengths.length > 80 ? lengths.filter((_, i) => i % Math.ceil(lengths.length / 80) === 0) : lengths;
  const words = text.split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^\w]/g, ''))).size;
  const vocabRichness = Math.round((uniqueWords / words.length) * 100);
  return { avg, min, max, total: sentences.length, sample, uniqueWords, vocabRichness };
}

// ─── Article Reader (full-screen panel) ──────────────────────────────────────
function ArticleReader({
  v, onClose, allVideos, onRelated
}: {
  v: VideoArticle;
  onClose: () => void;
  allVideos?: VideoArticle[];
  onRelated: (v: VideoArticle) => void;
}) {
  const paras = useMemo(() => formatTranscript(v.transcript), [v.transcript]);
  const toc = useMemo(() => buildTOC(paras), [paras]);
  const sentenceStats = useMemo(() => computeSentenceStats(v.transcript), [v.transcript]);
  const segments = useMemo(() => groupSegments(v.transcriptSegments ?? []), [v.transcriptSegments]);
  const SECTION_SIZE = 4;
  const contentRef = useRef<HTMLDivElement>(null);

  // Timestamp / translate view state
  const [viewMode, setViewMode] = useState<'text' | 'timestamps'>('text');
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState<string[]>([]);
  const [showTranslated, setShowTranslated] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (showTranslated && translated.length > 0) { setShowTranslated(false); return; }
    if (translated.length > 0) { setShowTranslated(true); return; }
    setTranslating(true);
    const srcLang = v.transcriptLang === 'hi' ? 'hi' : 'gu';
    const results = await Promise.all(paras.slice(0, 20).map(p => translatePara(p, srcLang)));
    setTranslated(results);
    setShowTranslated(true);
    setTranslating(false);
  }, [paras, showTranslated, translated, v.transcriptLang]);

  // Related articles — share ≥1 tag
  const relatedVideos = useMemo(() => {
    if (!allVideos || !v.tags?.length) return [];
    return allVideos
      .filter(r => r.id !== v.id && r.tags?.some(t => v.tags.includes(t)))
      .slice(0, 3);
  }, [allVideos, v]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Full keyboard nav: Escape=close, j=next section, k=prev section, [=prev related, ]=next related
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') { onClose(); return; }
      const content = contentRef.current;
      if (!content) return;
      if (e.key === 'j') {
        content.scrollBy({ top: 300, behavior: 'smooth' });
      } else if (e.key === 'k') {
        content.scrollBy({ top: -300, behavior: 'smooth' });
      } else if (e.key === ']' && relatedVideos[0]) {
        onRelated(relatedVideos[0]);
      } else if (e.key === '[' && relatedVideos[relatedVideos.length - 1]) {
        onRelated(relatedVideos[relatedVideos.length - 1]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onRelated, relatedVideos]);

  const scrollTo = (id: string) => {
    const el = contentRef.current?.querySelector(`#${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const dateStr = v.publishedAt && !v.publishedAt.startsWith("NA")
    ? new Date(v.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown Date";

  return (
    <div className="reader-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="reader-panel" role="dialog" aria-modal="true" aria-label={`Article: ${v.title}`}>

        {/* ── LEFT: TOC sidebar ── */}
        {toc.length > 1 && (
          <nav className="reader-toc" aria-label="Table of contents">
            <div className="reader-toc-label">Contents</div>
            <ol className="reader-toc-list">
              {toc.map(item => (
                <li key={item.id}>
                  <button className="reader-toc-item" onClick={() => scrollTo(item.id)}>
                    <span className="reader-toc-num">{item.label}</span>
                    <span className="reader-toc-preview">{item.preview}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* ── RIGHT: Article content ── */}
        <div className="reader-content" ref={contentRef}>
          {/* Close */}
          <button className="reader-close" onClick={onClose} aria-label="Close reader">✕</button>

          {/* Hero image */}
          <img
            src={v.thumbnail}
            alt={v.title}
            className="reader-hero-img"
            onError={e => { (e.currentTarget as HTMLImageElement).src = v.thumbnailMq; }}
          />

          {/* Meta */}
          <div className="reader-meta">
            {v.publishedAt && <time className="reader-date">{dateStr}</time>}
            {v.transcriptLang && (
              <span className="reader-lang-pill">{langLabel(v.transcriptLang)}</span>
            )}
            <span className="reader-read-time">~{v.readMinutes} min read</span>
            {v.views && <span className="reader-stat">👁 {v.views}</span>}
            {v.likes && <span className="reader-stat">👍 {v.likes}</span>}
            {v.comments && <span className="reader-stat">💬 {v.comments}</span>}
          </div>

          {/* Title */}
          <h1 className="reader-title">{v.title}</h1>

          <div className="reader-divider" />

          {/* Tags */}
          {v.tags.length > 0 && (
            <div className="reader-tags">
              {v.tags.map(t => <span key={t} className="article-tag">{t}</span>)}
            </div>
          )}

          {/* Sentence Analytics */}
          {!CONFIG.HIDE_TRANSCRIPTS && sentenceStats && (
            <div className="sentence-stats" title="Sentence length analysis">
              <div className="sentence-stat">
                <span className="sentence-stat-val">{sentenceStats.avg}</span>
                <span className="sentence-stat-label">avg words</span>
              </div>
              <div className="sentence-stat-sep" />
              <div className="sentence-stat">
                <span className="sentence-stat-val">{sentenceStats.min}</span>
                <span className="sentence-stat-label">shortest</span>
              </div>
              <div className="sentence-stat-sep" />
              <div className="sentence-stat">
                <span className="sentence-stat-val">{sentenceStats.max}</span>
                <span className="sentence-stat-label">longest</span>
              </div>
              <div className="sentence-stat-sep" />
              <div className="sentence-stat">
                <span className="sentence-stat-val">{sentenceStats.total}</span>
                <span className="sentence-stat-label">sentences</span>
              </div>
              <div className="sentence-stat-sep" />
              {/* Sparkline */}
              <div className="sentence-sparkline" title="Sentence length rhythm">
                {sentenceStats.sample.map((len, i) => {
                  const pct = Math.min(100, Math.round((len / Math.max(...sentenceStats.sample)) * 100));
                  const cls = len > sentenceStats.avg * 1.5 ? " long" : len < sentenceStats.avg * 0.5 ? " short" : "";
                  return (
                    <div
                      key={i}
                      className={`sentence-spark-bar${cls}`}
                      style={{ height: `${Math.max(10, pct)}%` }}
                      title={`${len} words`}
                    />
                  );
                })}
              </div>
              <div className="sentence-stat-sep" />
              <div className="sentence-stat">
                <span className="sentence-stat-val">{sentenceStats.vocabRichness}%</span>
                <span className="sentence-stat-label">vocab rich</span>
              </div>
              <div className="sentence-stat-sep" />
              {/* Sparkline */}
              <div className="sentence-sparkline" title="Sentence length rhythm">
                {sentenceStats.sample.map((len, i) => {
                  const pct = Math.min(100, Math.round((len / Math.max(...sentenceStats.sample)) * 100));
                  const cls = len > sentenceStats.avg * 1.5 ? " long" : len < sentenceStats.avg * 0.5 ? " short" : "";
                  return (
                    <div
                      key={i}
                      className={`sentence-spark-bar${cls}`}
                      style={{ height: `${Math.max(10, pct)}%` }}
                      title={`${len} words`}
                    />
                  );
                })}
              </div>
              {/* Keyboard hint */}
              <div className="reader-kbd-hint" title="Keyboard shortcuts">
                <span className="reader-kbd">j/k</span> scroll
                <span className="reader-kbd">[/]</span> related
                <span className="reader-kbd">Esc</span> close
              </div>
            </div>
          )}


          {/* View mode toggle */}
          {!CONFIG.HIDE_TRANSCRIPTS && (
            <div className="reader-view-toggle">
              <button className={`reader-view-btn${viewMode === 'text' ? ' active' : ''}`} onClick={() => setViewMode('text')}>
                📖 Read
              </button>
              {segments.length > 0 && (
                <button className={`reader-view-btn${viewMode === 'timestamps' ? ' active' : ''}`} onClick={() => setViewMode('timestamps')}>
                  ⏱ Timestamps
                </button>
              )}
              {v.transcriptLang && v.transcriptLang !== 'en' && paras.length > 0 && (
                <button
                  className={`reader-view-btn reader-translate-btn${showTranslated ? ' active' : ''}`}
                  onClick={handleTranslate}
                  disabled={translating}
                >
                  {translating ? '⏳ Translating…' : showTranslated ? '🔤 Original' : '🌐 → English'}
                </button>
              )}
            </div>
          )}

          {/* Transcript body — text reading mode */}
          {!CONFIG.HIDE_TRANSCRIPTS && viewMode === 'text' && paras.length > 0 && (
            <div className="reader-body">
              {paras.map((para, i) => {
                const sectionIdx = Math.floor(i / SECTION_SIZE);
                const isFirst = i % SECTION_SIZE === 0 && i > 0;
                return (
                  <div key={i}>
                    <p
                      id={isFirst ? `section-${sectionIdx}` : undefined}
                      className={`reader-para${isFirst ? " reader-section-start" : ""}`}
                    >
                      {para}
                    </p>
                    {showTranslated && translated[i] && (
                      <p className="reader-para reader-para-translated">
                        <span className="reader-translated-label">EN·</span> {translated[i]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Timestamps view — clickable YouTube deep-links */}
          {!CONFIG.HIDE_TRANSCRIPTS && viewMode === 'timestamps' && segments.length > 0 && (
            <div className="reader-timestamps">
              <p className="reader-timestamps-hint">⏱ Click any timestamp to jump to that moment on YouTube.</p>
              {segments.map((seg, i) => (
                <a
                  key={i}
                  href={`${v.url}&t=${seg.t}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reader-ts-row"
                >
                  <span className="reader-ts-time">{fmtTime(seg.t)}</span>
                  <span className="reader-ts-text">{seg.text}</span>
                </a>
              ))}
            </div>
          )}

          {/* Fallback or Hidden Transcript */}
          {(CONFIG.HIDE_TRANSCRIPTS || (viewMode === 'text' && paras.length === 0)) && (
            v.description ? (
              <div className="reader-body">
                {CONFIG.HIDE_TRANSCRIPTS ? (
                  <p className="reader-para reader-desc-note">📝 Transcript access is currently restricted. Showing video description:</p>
                ) : (
                  <p className="reader-para reader-desc-note">📝 No transcript — showing video description:</p>
                )}
                <p className="reader-para" style={{ whiteSpace: 'pre-wrap' }}>{cleanDescription(v.description)}</p>
              </div>
            ) : (
              <p className="reader-no-transcript">
                {CONFIG.HIDE_TRANSCRIPTS ? "Transcript access is currently restricted." : "No transcript available for this video."}
              </p>
            )
          )}

          {/* Related articles */}
          {relatedVideos && relatedVideos.length > 0 && (
            <div className="reader-related">
              <div className="reader-related-label">Related Articles</div>
              <div className="reader-related-list">
                {relatedVideos.map(r => (
                  <button key={r.id} className="reader-related-item" onClick={() => onRelated(r)}>
                    <img src={r.thumbnailMq} alt={r.title} className="reader-related-thumb" onError={e => { (e.currentTarget as HTMLImageElement).src = r.thumbnail; }} />
                    <span className="reader-related-title">{r.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="reader-footer">
            <a href={v.url} target="_blank" rel="noopener noreferrer" className="reader-yt-btn"
              onClick={() => track("article_watch", { videoId: v.id })}>
              ▶ Watch on YouTube
            </a>
            <button className="reader-action-btn" onClick={() => {
              const text = `${v.title} — Dr. Praduman Khachar. ${new Date(v.publishedAt).getFullYear()}. YouTube. ${v.url}`;
              navigator.clipboard.writeText(text);
              track("article_cite", { videoId: v.id });
            }} title="Copy citation">
              📋 Cite
            </button>
            <button className="reader-action-btn" onClick={() => {
              if (navigator.share) {
                navigator.share({ title: v.title, text: `Read: ${v.title}`, url: `${window.location.origin}/articles/${v.slug}` });
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/articles/${v.slug}`);
              }
              track("article_share", { videoId: v.id });
            }} title="Share article">
              🔗 Share
            </button>
            <button className="reader-action-btn" onClick={() => window.print()} title="Print / Save as PDF">
              🖨 Print
            </button>
            <span className="reader-word-count">{v.transcriptWordCount.toLocaleString()} words</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reading difficulty ───────────────────────────────────────────────────────
function difficultyLabel(transcript: string): { label: string; cls: string } | null {
  if (!transcript || transcript.length < 50) return null;
  const words = transcript.split(/\s+/).filter(Boolean);
  const avgLen = words.reduce((s, w) => s + w.replace(/[^\w]/g, '').length, 0) / words.length;
  if (avgLen < 4.5) return { label: 'Accessible', cls: 'diff-easy' };
  if (avgLen < 5.5) return { label: 'Standard', cls: 'diff-mid' };
  return { label: 'Scholarly', cls: 'diff-hard' };
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ v, index, onOpen }: { v: VideoArticle; index: number; onOpen: (v: VideoArticle) => void }) {
  const [ref, visible] = useReveal();
  const difficulty = difficultyLabel(v.transcript);

  return (
    <article
      ref={ref}
      className="article-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ${(index % 6) * 0.07}s ease`,
        cursor: "pointer",
      }}
      onClick={() => {
        track("article_open", { videoId: v.id, title: v.title.slice(0, 50) });
        onOpen(v);
      }}
      onKeyDown={e => e.key === "Enter" && onOpen(v)}
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${v.title}`}
    >
      {/* Thumbnail — clicking doesn't navigate to YT, whole card opens reader */}
      <div className="article-thumb">
        <img
          src={v.thumbnailMq}
          alt={v.title}
          loading="lazy"
          onError={e => { (e.currentTarget as HTMLImageElement).src = v.thumbnail; }}
        />
        <span className="article-thumb-play">📖</span>
        <span className="article-thumb-duration">{v.readMinutes} min read</span>
      </div>

      {/* Content */}
      <div className="article-content">
        <div className="article-meta">
          {v.publishedAt && (
            <time className="article-date">
              {!v.publishedAt.startsWith("NA") ? relativeDate(v.publishedAt) : "Unknown Date"}
            </time>
          )}
          {v.transcriptWordCount > 0 && (
            <span className="article-transcript-badge" title="Transcript available">
              📝 {langLabel(v.transcriptLang)}
            </span>
          )}
          {difficulty && (
            <span className={`article-difficulty ${difficulty.cls}`} title="Reading difficulty">
              {difficulty.label}
            </span>
          )}
          {v.views && <span className="article-views">👁 {v.views}</span>}
        </div>

        <h3 className="article-title">{v.title}</h3>

        {v.description && (
          <p className="article-desc">{v.description.slice(0, 160)}…</p>
        )}

        {v.tags && v.tags.length > 0 && (
          <div className="article-tags">
            {v.tags.slice(0, 4).map(t => <span key={t} className="article-tag">{t}</span>)}
          </div>
        )}

        <div className="article-footer">
          <span className="article-watch-link">Read article →</span>
          {v.transcriptWordCount > 0 && (
            <span className="article-word-count">{v.transcriptWordCount.toLocaleString()} words</span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="articles-empty">
      <div className="articles-empty-icon">📜</div>
      <h2>Articles Not Yet Generated</h2>
      <p>Run the scraper to pull all 575+ videos and transcripts from YouTube. Fully resumable.</p>
      <div className="articles-empty-code"><code>npm run scrape:channel:test</code><span>— trial with 5 videos</span></div>
      <div className="articles-empty-code"><code>npm run scrape:channel</code><span>— full channel (575 videos, yt-dlp)</span></div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ArticlesPage() {
  usePageTitle("Video Articles");
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoArticle[] | null>(null);
  const [meta, setMeta] = useState<Omit<VideosJson, "videos"> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "words" | "views">("date");
  const [openArticle, setOpenArticle] = useState<VideoArticle | null>(null);

  useEffect(() => {
    loadVideos().then(data => {
      if (data) {
        setVideos(data.videos);
        setMeta({ scraped_at: data.scraped_at, total: data.total, transcript_ok: data.transcript_ok, transcript_fail: data.transcript_fail });
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (slug && slug !== "-" && videos && videos.length > 0) {
      const match = videos.find(v => v.slug === slug || v.id === slug);
      if (match) setOpenArticle(match);
    }
  }, [slug, videos]);

  const handleOpen = useCallback((v: VideoArticle) => {
    setOpenArticle(v);
    const validSlug = v.slug && v.slug !== "-" ? v.slug : v.id;
    navigate(`/articles/${validSlug}`, { replace: false });
    track("article_open", { videoId: v.id, title: v.title.slice(0, 50) });
  }, [navigate]);

  const handleClose = useCallback(() => {
    setOpenArticle(null);
    navigate("/articles", { replace: false });
  }, [navigate]);

  const langs = useMemo(() => {
    if (!videos) return [];
    return [...new Set(videos.map(v => v.transcriptLang).filter(Boolean))] as string[];
  }, [videos]);

  const filtered = useMemo(() => {
    if (!videos) return [];
    let list = [...videos];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (langFilter !== "all") list = list.filter(v => v.transcriptLang === langFilter);
    if (sortBy === "words") list.sort((a, b) => b.transcriptWordCount - a.transcriptWordCount);
    else if (sortBy === "views") list.sort((a, b) => parseInt((b.views || "0").replace(/\D/g, "")) - parseInt((a.views || "0").replace(/\D/g, "")));
    else list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return list;
  }, [videos, search, langFilter, sortBy]);

  return (
    <>
      {openArticle && (
        <ArticleReader
          v={openArticle}
          onClose={handleClose}
          allVideos={videos || []}
          onRelated={handleOpen}
        />
      )}

      <PageHeader
        label="Video Articles"
        title="History in Every Frame"
        subtitle="Every lecture, documentary, and discussion — now searchable, readable, and transcribed."
        dark
      />

      <main className="section articles-page">
        {meta && (
          <div className="articles-meta-strip">
            <span>{meta.total} videos indexed</span>
            <span>·</span>
            <span>{meta.transcript_ok} transcripts available</span>
            <span>·</span>
            <span>Updated {relativeDate(meta.scraped_at)}</span>
          </div>
        )}

        {videos && videos.length > 0 && (
          <div className="articles-controls">
            <input
              type="search"
              className="articles-search"
              placeholder="Search titles, tags, descriptions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search articles"
              id="articles-search"
            />
            <div className="articles-filters">
              <select className="articles-select" value={langFilter} onChange={e => setLangFilter(e.target.value)} id="articles-lang-filter">
                <option value="all">All Languages</option>
                {langs.map(l => <option key={l} value={l}>{langLabel(l)}</option>)}
              </select>
              <select className="articles-select" value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} id="articles-sort">
                <option value="date">Newest First</option>
                <option value="words">Most Words</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        )}

        {search && <p className="articles-results-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"</p>}

        {!loaded ? (
          <div className="articles-loading"><div className="articles-loading-spinner" /><p>Loading articles…</p></div>
        ) : videos && videos.length > 0 ? (
          <div className="articles-grid">
                {filtered.map((v, i) => <ArticleCard key={v.id} v={v} index={i} onOpen={handleOpen} />)}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </>
  );
}
