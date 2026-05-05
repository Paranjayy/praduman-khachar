/**
 * src/pages/Articles.tsx
 *
 * Video Articles page — inline transcript reader
 * Supports /articles/:slug deep-links, share, citation copy, print.
 */

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Share2, Printer, Quote, Play, X, ArrowLeft, ArrowRight, Download } from "lucide-react";
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
  durationSeconds?: number;
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
  } catch (err) {
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

function cleanDescription(desc: string): string {
  if (!desc) return '';
  return desc
    .replace(/Social Media Links[^\n]*/gi, '')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/📷[^\n]*/g, '')
    .replace(/🕊[^\n]*/g, '')
    .replace(/Telegram[^\n]*/gi, '')
    .replace(/Facebook[^\n]*/gi, '')
    .replace(/Instagram[^\n]*/gi, '')
    .replace(/Twitter[^\n]*/gi, '')
    .replace(/--\|[^\n]*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatTranscript(raw: string): string[] {
  if (!raw) return [];
  const sentences = raw
    .replace(/([।॥])/g, "$1\n")
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

// ─── Article Reader ──────────────────────────────────────────────────────────
function ArticleReader({
  v, onClose, allVideos, onRelated, startTime = 0
}: {
  v: VideoArticle;
  onClose: () => void;
  allVideos?: VideoArticle[];
  onRelated: (v: VideoArticle) => void;
  startTime?: number;
}) {
  const paras = useMemo(() => formatTranscript(v.transcript), [v.transcript]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 100 : Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      setReadProgress(pct);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const dateStr = v.publishedAt && !v.publishedAt.startsWith("NA")
    ? new Date(v.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown Date";

  return (
    <motion.div 
      className="reader-overlay goated"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        className="reader-panel goated"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {/* Persistent Topbar */}
        <div className="reader-topbar">
          <div className="reader-topbar-left">
            <button className="reader-back-btn" onClick={onClose}><X size={20} /></button>
            <div className="reader-topbar-title">{v.title}</div>
          </div>
          <div className="reader-topbar-right">
             <div className="reader-topbar-progress">{readProgress}%</div>
             <div className="reader-topbar-actions">
                <button title="Print" onClick={() => window.print()}><Printer size={18} /></button>
                <button title="Share" onClick={() => navigator.clipboard.writeText(window.location.href)}><Share2 size={18} /></button>
             </div>
          </div>
        </div>

        <div className="reader-progress-bar-fixed" style={{ width: `${readProgress}%` }} />

        <div className="reader-content-scroll" ref={contentRef}>
          <div className="reader-editorial-wrap widened">
            <header className="reader-header">
              <div className="reader-eyebrow">Archive Video Entry · {v.id.toUpperCase()}</div>
              <h1 className="reader-title large">{v.title}</h1>
              <div className="reader-meta">
                <div className="reader-meta-item"><span>Published</span><strong>{dateStr}</strong></div>
                <div className="reader-meta-item"><span>Views</span><strong>{v.views || "—"}</strong></div>
                <div className="reader-meta-item"><span>Lang</span><strong>{langLabel(v.transcriptLang) || "Gujarati"}</strong></div>
                <div className="reader-meta-item"><span>Length</span><strong>{v.durationSeconds ? `${Math.floor(v.durationSeconds/60)}m` : "—"}</strong></div>
              </div>
            </header>

            <div className="reader-grid-layout">
              <div className="reader-main-column">
                <div className="reader-hero-visual">
                  <div className="reader-yt-embed-wrap">
                    <iframe
                      className="reader-yt-embed"
                      src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1${startTime ? `&start=${startTime}` : ''}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                <div className="reader-actions-ribbon">
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="reader-cta-btn youtube">
                    <Play size={16} fill="currentColor" /> Watch on YouTube
                  </a>
                  <button className="reader-cta-btn secondary" onClick={() => {
                    const text = `${v.title} — Dr. Praduman Khachar. ${new Date(v.publishedAt).getFullYear()}. YouTube. ${v.url}`;
                    navigator.clipboard.writeText(text);
                  }}>
                    <Quote size={16} /> Copy Citation
                  </button>
                  <button className="reader-cta-btn secondary">
                    <Download size={16} /> Offline Copy
                  </button>
                </div>

                <div className="reader-main-body">
                  <div className="reader-body-label">TRANSCRIPT & DESCRIPTION</div>
                  {paras.length > 0 ? (
                    <div className="reader-transcript">
                      {paras.map((p, i) => (
                        <motion.p 
                          key={i} 
                          className="reader-para"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          viewport={{ once: true }}
                        >
                          {p}
                        </motion.p>
                      ))}
                    </div>
                  ) : (
                    <div className="reader-transcript empty">
                      <p className="reader-para description">{cleanDescription(v.description) || "No transcript or description available."}</p>
                    </div>
                  )}
                </div>
              </div>

              <aside className="reader-sidebar">
                <div className="sidebar-section">
                  <div className="sidebar-label">VIDEO TAGS</div>
                  <div className="sidebar-tags">
                    {v.tags.map(t => <span key={t} className="sidebar-tag">{t}</span>)}
                  </div>
                </div>
                
                {allVideos && (
                  <div className="sidebar-section">
                    <div className="sidebar-label">RELATED ENTRIES</div>
                    <div className="sidebar-related-list">
                      {allVideos.slice(0, 4).filter(x => x.id !== v.id).map(r => (
                        <button key={r.id} className="sidebar-related-item" onClick={() => onRelated(r)}>
                           <img src={r.thumbnailMq} alt="" />
                           <div className="sidebar-related-title">{r.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>

            <footer className="reader-editorial-footer">
              <div className="footer-rule" />
              <div className="footer-content">
                <div className="footer-brand">Dr. Praduman Khachar Archive</div>
                <div className="footer-stats">{v.transcriptWordCount.toLocaleString()} words indexed</div>
              </div>
            </footer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ArticlesPage() {
  usePageTitle("Archive Articles");
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoArticle[] | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [openArticle, setOpenArticle] = useState<VideoArticle | null>(null);

  useEffect(() => {
    loadVideos().then(data => {
      if (data) setVideos(data.videos);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (slug && videos) {
      const match = videos.find(v => v.slug === slug || v.id === slug);
      if (match) setOpenArticle(match);
    }
  }, [slug, videos]);

  const handleOpen = (v: VideoArticle) => {
    setOpenArticle(v);
    navigate(`/articles/${v.slug || v.id}`);
  };

  const handleClose = () => {
    setOpenArticle(null);
    navigate("/articles");
  };

  return (
    <>
      <PageHeader 
        eyebrow="Archival Records"
        title="Historical Video Essays"
        subtitle="Exploring the legacy of Saurashtra through primary visual records and transcripts."
      />

      <main className="section articles-page full-width">
        {!loaded ? (
          <div className="loading">Indexing archive…</div>
        ) : (
          <div className="articles-grid-large">
            {videos?.map((v, i) => (
              <ArticleCard key={v.id} v={v} index={i} onOpen={handleOpen} />
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {openArticle && (
          <ArticleReader 
            v={openArticle} 
            onClose={handleClose} 
            allVideos={videos || []} 
            onRelated={handleOpen} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ArticleCard({ v, index, onOpen }: { v: VideoArticle; index: number; onOpen: (v: VideoArticle) => void }) {
  const [ref, visible] = useReveal();
  return (
    <motion.article
      ref={ref}
      className="article-card-premium large"
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 8) * 0.05 }}
      onClick={() => onOpen(v)}
    >
      <div className="article-thumb-wrap-large">
        <img src={v.thumbnailMq} alt={v.title} loading="lazy" />
        <div className="article-thumb-overlay"><Play size={32} fill="white" /></div>
        <div className="article-badge-duration">{v.durationSeconds ? `${Math.floor(v.durationSeconds/60)}m` : "Video"}</div>
      </div>
      <div className="article-info">
        <div className="article-meta-row">
          <span className="article-date">{relativeDate(v.publishedAt)}</span>
          {v.transcriptLang && <span className="article-lang-badge">{v.transcriptLang.toUpperCase()}</span>}
        </div>
        <h3 className="article-title-lg">{v.title}</h3>
      </div>
    </motion.article>
  );
}
