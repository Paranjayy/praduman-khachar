import { useState, useEffect } from "react";
import { SOCIALS, PLAYLISTS, PLAYLIST_CATEGORIES } from "../data/content";
import { useReveal } from "../hooks/useAnimations";
import type { Playlist } from "../types";

const CHANNEL_URL = "https://www.youtube.com/@PradumanKhachar";
const UPLOADS_PLAYLIST = "UUcxf3xuzjb9exyfzdrjdxo";

interface VideoEntry {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  published: string;
}

const ICONS: Record<string, JSX.Element> = {
  youtube: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  instagram: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  facebook: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  twitter: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  spotify: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>,
  blog: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>,
};

export default function MediaPage() {
  const [ref, visible] = useReveal();
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"videos" | "playlists">("videos");
  const [activeCat, setActiveCat] = useState<string>("all");

  useEffect(() => {
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((data) => { setVideos(data.videos || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCat === "all"
    ? PLAYLISTS
    : PLAYLISTS.filter((p) => p.category === activeCat);

  const totalVideos = PLAYLISTS.reduce((a, p) => a + p.count, 0);

  return (
    <main className="page-content">
      {/* Hero */}
      <section className="media-page-hero">
        <div className="media-page-hero-inner">
          <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
            <p className="section-label" style={{ color: "var(--c-amber-light)" }}>Media &amp; Digital Presence</p>
            <h1 className="section-title" style={{ color: "var(--c-parchment)" }}>
              575 Videos.<br />History, Narrated.
            </h1>
            <div className="section-divider" style={{ background: "var(--c-amber)" }} />
            <p className="media-page-subtitle">
              42,600+ subscribers · 575 videos · 33 playlists. Dr. Khachar
              brings Gujarat's forgotten stories to life — on YouTube, radio, television, and print.
            </p>
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer"
              className="yt-channel-btn" style={{ marginTop: "var(--space-lg)", display: "inline-flex" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe · @PradumanKhachar
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="media-page-stats">
        {[
          { number: "42.6K+", label: "Subscribers" },
          { number: "575", label: "Videos" },
          { number: `${totalVideos}+`, label: "Playlist Videos" },
          { number: "33", label: "Playlists" },
          { number: "12", label: "AIR Appearances" },
          { number: "6", label: "Doordarshan" },
        ].map((s, i) => <MediaStatCard key={i} {...s} index={i} />)}
      </div>

      {/* YouTube section */}
      <section className="section">
        <h2 className="section-title">YouTube Channel</h2>
        <div className="section-divider" />

        <div className="yt-tabs">
          <button className={`yt-tab${activeTab === "videos" ? " active" : ""}`} onClick={() => setActiveTab("videos")}>
            Latest Videos
          </button>
          <button className={`yt-tab${activeTab === "playlists" ? " active" : ""}`} onClick={() => setActiveTab("playlists")}>
            All Playlists ({PLAYLISTS.length})
          </button>
        </div>

        {activeTab === "videos" && (
          <>
            {loading ? (
              <div className="yt-loading">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="yt-skeleton" />)}</div>
            ) : videos.length > 0 ? (
              <div className="yt-video-grid">
                {videos.map((v) => <VideoCard key={v.id} {...v} />)}
              </div>
            ) : (
              <div className="yt-embed-fallback">
                <iframe src={`https://www.youtube.com/embed/videoseries?list=${UPLOADS_PLAYLIST}&rel=0`}
                  title="Praduman Khachar YouTube Channel"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen loading="lazy" />
                <p className="yt-fallback-note">
                  Browse all 575+ videos on <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">YouTube →</a>
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "playlists" && (
          <>
            {/* Category filter pills */}
            <div className="playlist-cat-filter">
              <button className={`pl-cat-pill${activeCat === "all" ? " active" : ""}`} onClick={() => setActiveCat("all")}>
                All ({PLAYLISTS.length})
              </button>
              {Object.entries(PLAYLIST_CATEGORIES).map(([key, label]) => {
                const cnt = PLAYLISTS.filter((p) => p.category === key).length;
                if (cnt === 0) return null;
                return (
                  <button key={key} className={`pl-cat-pill${activeCat === key ? " active" : ""}`} onClick={() => setActiveCat(key)}>
                    {label} ({cnt})
                  </button>
                );
              })}
            </div>

            <div className="playlists-grid">
              {filtered.map((pl, i) => <PlaylistCard key={i} pl={pl} index={i} />)}
            </div>

            <a href={`${CHANNEL_URL}/playlists`} target="_blank" rel="noopener noreferrer" className="playlist-view-all">
              View All Playlists on YouTube →
            </a>
          </>
        )}
      </section>

      {/* Other media */}
      <section className="section">
        <h2 className="section-title">Other Media</h2>
        <div className="section-divider" />
        <div className="podcast-grid">
          {[
            { emoji: "🎙️", title: "Spotify Podcast", text: "Historical narratives available on Spotify.", link: "https://open.spotify.com/show/3QezwwyZYMk9PlSXsX0Erf", linkText: "Listen on Spotify →" },
            { emoji: "📻", title: "All India Radio", text: "Featured 12 times on AIR — delivering historical talks on Saurashtra's heritage to a national audience." },
            { emoji: "📺", title: "Doordarshan", text: "6 appearances on national television for historical documentaries and expert commentary." },
            { emoji: "📰", title: "Newspaper Columns", text: "Regular columnist for Mumbai Samachar (2 yrs) and Fulchhab (3 yrs)." },
          ].map((item, i) => (
            <div key={i} className="podcast-card">
              <div className="podcast-icon">{item.emoji}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="podcast-link">{item.linkText}</a>}
            </div>
          ))}
        </div>
      </section>

      {/* Social */}
      <section className="section">
        <h2 className="section-title">Find Dr. Khachar Online</h2>
        <div className="section-divider" />
        <div className="social-grid-full">
          {SOCIALS.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="social-grid-item">
              <div className="social-grid-icon">{ICONS[s.icon]}</div>
              <span className="social-name">{s.name}</span>
              <span className="social-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section className="section">
        <div className="coming-soon-banner">
          <span className="cs-badge">Coming Soon</span>
          <h3>Video → Article Conversion</h3>
          <p>Converting all 575+ historical video lectures into searchable, readable articles — making Dr. Khachar's knowledge accessible in every format.</p>
        </div>
      </section>
    </main>
  );
}

function VideoCard({ id, title, thumbnail, url, published }: VideoEntry) {
  const [ref, visible] = useReveal(0.05);
  const date = published
    ? new Date(published).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    : "";
  return (
    <a ref={ref} href={url} target="_blank" rel="noopener noreferrer" className="yt-video-card"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "all 0.4s ease" }}>
      <div className="yt-thumb-wrap">
        <img src={thumbnail} alt={title} loading="lazy" />
        <div className="yt-play-btn">
          <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div className="yt-video-info">
        <p className="yt-video-title">{title}</p>
        {date && <p className="yt-video-date">{date}</p>}
      </div>
    </a>
  );
}

function PlaylistCard({ pl, index }: { pl: Playlist; index: number }) {
  const [ref, visible] = useReveal(0.05);
  const href = pl.id
    ? `https://www.youtube.com/playlist?list=${pl.id}`
    : `https://www.youtube.com/@PradumanKhachar/playlists`;
  return (
    <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className="playlist-full-card"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: `all 0.4s ${(index % 8) * 0.05}s ease` }}>
      <span className="playlist-full-emoji">{pl.emoji}</span>
      <div className="playlist-full-body">
        <div className="playlist-full-gu">{pl.title.startsWith("‌") ? pl.titleEn : pl.title}</div>
        <div className="playlist-full-en">{pl.titleEn}</div>
      </div>
      <div className="playlist-full-count">
        <span>{pl.count}</span>
        <span className="playlist-full-vids">videos</span>
      </div>
    </a>
  );
}

function MediaStatCard({ number, label, index }: { number: string; label: string; index: number }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} className="media-page-stat-card"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: `all 0.5s ${index * 0.07}s ease` }}>
      <div className="media-page-stat-num">{number}</div>
      <div className="media-page-stat-label">{label}</div>
    </div>
  );
}
