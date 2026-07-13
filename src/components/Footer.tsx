import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SITE, SOCIALS } from "../data/content";

const ICONS: Record<string, (size: number) => JSX.Element> = {
  youtube: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  instagram: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  facebook: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  twitter: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  spotify: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12C24 5.4 18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),
  blog: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.013 7.373 20 6.18 20A2.18 2.18 0 0 1 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44M4 10.1a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
    </svg>
  ),
};

const COLOR_MAP: Record<string, string> = {
  youtube: "#FF0000",
  instagram: "#E1306C",
  facebook: "#1877F2",
  twitter: "#000000",
  linkedin: "#0A66C2",
  spotify: "#1DB954",
  blog: "#FB8C00",
};

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Books", to: "/books" },
  { label: "Media", to: "/media" },
  { label: "Explore", to: "/explore" },
  { label: "Press", to: "/press" },
  { label: "Gallery", to: "/gallery" },
  { label: "Timeline", to: "/timeline" },
  { label: "Citations", to: "/citations" },
  { label: "Map", to: "/map" },
  { label: "Labs", to: "/labs" },
];



function formatRelative(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [ingestionStats, setIngestionStats] = useState<{ ok: number; total: number } | null>(null);
  const [shareLabel, setShareLabel] = useState("Share");
  const [builtAt, setBuiltAt] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/videos.json')
      .then(r => r.json())
      .then(data => {
        setIngestionStats({
          ok: data.transcript_ok || 0,
          total: data.total || 0
        });
      })
      .catch(() => {});
    fetch('/build-info.json')
      .then(r => r.json())
      .then(data => {
        if (data?.builtAt) setBuiltAt(data.builtAt);
      })
      .catch(() => {
        setBuiltAt(new Date().toISOString());
      });
  }, []);

  return (
    <>
      <style>{`
        .footer-socials-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .footer-social-icon-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--c-border-light);
          color: var(--c-ink-muted);
          text-decoration: none;
          transition: all 0.25s ease;
          border: 1px solid transparent;
        }
        .footer-social-icon-link:hover {
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px oklch(0.3 0.05 60 / 0.18);
        }
        .footer-social-icon-link svg {
          width: 18px;
          height: 18px;
        }
        .footer-bottom {
          flex-wrap: wrap;
          gap: 0.6rem 1rem;
        }
        .footer-bottom-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem 0.8rem;
          align-items: center;
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: var(--c-ink-muted);
        }
        .footer-bottom-row a { color: var(--c-ink-muted); text-decoration: none; }
        .footer-bottom-row a:hover { color: var(--c-terracotta); }
        .footer-sep { opacity: 0.4; }
        .footer-share-btn {
          background: none;
          border: 1px solid var(--c-border);
          color: var(--c-ink-muted);
          font-family: inherit;
          font-size: inherit;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .footer-share-btn:hover { color: var(--c-terracotta); border-color: var(--c-terracotta); }
        .footer-build-info {
          font-family: var(--font-body);
          font-size: 0.72rem;
          color: var(--c-ink-muted);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .build-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--c-sage);
          box-shadow: 0 0 6px var(--c-sage);
        }
      `}</style>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-brand-name notranslate" translate="no">{SITE.name}</span>
            <p className="footer-tagline">{SITE.tagline}</p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <ul className="footer-links">
              {FOOTER_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-socials">
            <div className="footer-socials-grid">
              {SOCIALS.filter(s => ["youtube", "instagram", "facebook", "twitter", "linkedin", "spotify"].includes(s.icon)).map(s => {
                const Icon = ICONS[s.icon];
                const color = COLOR_MAP[s.icon] || "#5c4f3d";
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon-link"
                    aria-label={s.name}
                    title={s.name}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--c-border-light)";
                    }}
                  >
                    {Icon ? Icon(18) : <span>{s.name[0]}</span>}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-row">
              <span>© {year} <span className="notranslate" translate="no">{SITE.name}</span></span>
              <span className="footer-sep">·</span>
              <Link to="/legal/privacy">Privacy</Link>
              <span className="footer-sep">·</span>
              <Link to="/legal/terms">Terms</Link>
              <span className="footer-sep">·</span>
              <span>{SITE.location}</span>
              <span className="footer-sep">·</span>
              <button
                className="footer-share-btn"
                onClick={async () => {
                  const url = window.location.origin;
                  try {
                    await navigator.clipboard.writeText(url);
                    setShareLabel("Copied!");
                  } catch {
                    setShareLabel("Press ⌘C");
                  }
                  setTimeout(() => setShareLabel("Share"), 1500);
                }}
                title="Copy site URL"
              >
                🔗 {shareLabel}
              </button>
            </div>

            <div className="footer-bottom-row">
              {ingestionStats && (
                <span title="Transcript Ingestion Status">
                  <span className="build-dot" style={{ background: "#c4882d" }} />
                  {ingestionStats.ok}/{ingestionStats.total} Transcripts
                </span>
              )}
              <span className="footer-sep">·</span>
              <span className="footer-build-info" title={builtAt ? `Built ${new Date(builtAt).toLocaleString()}` : "Loading…"}>
                <span className="build-dot" />
                {builtAt ? <>Updated {formatRelative(builtAt)}</> : "Updated…"}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
