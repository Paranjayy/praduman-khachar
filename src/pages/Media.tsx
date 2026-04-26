import { SOCIALS, MEDIA_STATS } from "../data/content";
import { useReveal } from "../hooks/useAnimations";

// YouTube Channel ID for Praduman Khachar
const YT_CHANNEL_ID = "UCT5k6p8ycHAaKfK4zPuH1yA"; // Praduman Khachar channel
const YT_CHANNEL_URL = "https://www.youtube.com/c/PradumanKhachar";

// Featured playlists - these can be updated manually or via API later
const PLAYLISTS = [
  {
    title: "Historical Lectures",
    desc: "In-depth lectures on Saurashtra and Gujarat's history, covering kingdoms, battles, and cultural heritage.",
    emoji: "🏛️",
  },
  {
    title: "Book Discussions",
    desc: "Author talks and discussions about each of the 33 published books, with behind-the-scenes research insights.",
    emoji: "📚",
  },
  {
    title: "Heritage Walks",
    desc: "Virtual tours of historical sites, forts, temples, and architectural landmarks across Gujarat.",
    emoji: "🗺️",
  },
  {
    title: "Kathi History Series",
    desc: "Dedicated series exploring the history, culture, and legacy of the Kathi community and their kingdoms.",
    emoji: "⚔️",
  },
];

export default function MediaPage() {
  const [ref, visible] = useReveal();

  return (
    <main className="page-content">
      {/* Hero section */}
      <section className="media-page-hero">
        <div className="media-page-hero-inner">
          <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
            <p className="section-label" style={{ color: "var(--c-amber-light)" }}>
              Media &amp; Digital Presence
            </p>
            <h1 className="section-title" style={{ color: "var(--c-parchment)" }}>
              485+ Videos.<br />History, Narrated.
            </h1>
            <div className="section-divider" style={{ background: "var(--c-amber)" }} />
            <p className="media-page-subtitle">
              Dr. Khachar brings Gujarat's forgotten stories to life through
              educational videos, podcasts, radio broadcasts, and public lectures
              — reaching audiences far beyond the classroom.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="media-page-stats">
        {MEDIA_STATS.map((s, i) => (
          <MediaStatCard key={i} {...s} index={i} />
        ))}
        <MediaStatCard number="12" label="All India Radio Appearances" index={3} />
        <MediaStatCard number="6" label="Doordarshan Broadcasts" index={4} />
        <MediaStatCard number="5+" label="Years Newspaper Columnist" index={5} />
      </div>

      {/* YouTube section */}
      <section className="section">
        <h2 className="section-title">YouTube Channel</h2>
        <div className="section-divider" />
        <div className="yt-embed-row">
          <div className="yt-featured">
            <iframe
              src={`https://www.youtube.com/embed?listType=user_uploads&list=PradumanKhachar`}
              title="Latest video from Praduman Khachar"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
            <a
              href={YT_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-channel-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Visit Channel · Subscribe
            </a>
          </div>
          <div className="yt-playlists">
            <h3 className="yt-playlists-heading">Playlists &amp; Series</h3>
            {PLAYLISTS.map((pl, i) => (
              <PlaylistCard key={i} {...pl} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Podcast / Radio */}
      <section className="section">
        <h2 className="section-title">Podcast &amp; Radio</h2>
        <div className="section-divider" />
        <div className="podcast-grid">
          <div className="podcast-card">
            <div className="podcast-icon">🎙️</div>
            <h3>Spotify Podcast</h3>
            <p>Historical narratives and discussions available on Spotify. Listen to curated episodes covering Gujarat's heritage.</p>
            <a
              href="https://open.spotify.com/show/3QezwwyZYMk9PlSXsX0Erf"
              target="_blank"
              rel="noopener noreferrer"
              className="podcast-link"
            >
              Listen on Spotify →
            </a>
          </div>
          <div className="podcast-card">
            <div className="podcast-icon">📻</div>
            <h3>All India Radio</h3>
            <p>Featured 12 times on All India Radio, delivering historical talks and discussions on Saurashtra's heritage to a national audience.</p>
          </div>
          <div className="podcast-card">
            <div className="podcast-icon">📺</div>
            <h3>Doordarshan</h3>
            <p>Appeared 6 times on Doordarshan (national television) for historical documentaries and expert commentary on Gujarat's past.</p>
          </div>
          <div className="podcast-card">
            <div className="podcast-icon">📰</div>
            <h3>Newspaper Columns</h3>
            <p>Regular historical columnist for <strong>Mumbai Samachar</strong> (2 years) and <strong>Fulchhab</strong> (3 years), reaching thousands of readers.</p>
          </div>
        </div>
      </section>

      {/* All Social Links */}
      <section className="section">
        <h2 className="section-title">Find Dr. Khachar Online</h2>
        <div className="section-divider" />
        <div className="social-grid-full">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-grid-item"
            >
              <span className="social-name">{s.name}</span>
              <span className="social-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* Future: YouTube transcript → articles CTA */}
      <section className="section">
        <div className="coming-soon-banner">
          <span className="cs-badge">Coming Soon</span>
          <h3>Video → Article Conversion</h3>
          <p>
            We're working on converting all 485+ historical video lectures into
            searchable, readable articles — making Dr. Khachar's knowledge
            accessible to everyone, in every format.
          </p>
        </div>
      </section>
    </main>
  );
}

function MediaStatCard({ number, label, index }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="media-page-stat-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `all 0.5s ${index * 0.08}s ease`,
      }}
    >
      <div className="media-page-stat-num">{number}</div>
      <div className="media-page-stat-label">{label}</div>
    </div>
  );
}

function PlaylistCard({ title, desc, emoji, index }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="playlist-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(12px)",
        transition: `all 0.5s ${index * 0.1}s ease`,
      }}
    >
      <span className="playlist-emoji">{emoji}</span>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}
