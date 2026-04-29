import { Link } from "react-router-dom";
import { SITE, SOCIALS } from "../data/content";

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Books", to: "/books" },
  { label: "Media", to: "/media" },
  { label: "Articles", to: "/articles" },
  { label: "Explore", to: "/explore" },
  { label: "Press", to: "/press" },
  { label: "Labs", to: "/labs" },
];

const SOCIAL_LABELS: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  twitter: "X / Twitter",
  spotify: "Spotify",
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand + tagline */}
        <div className="footer-brand">
          <span className="footer-brand-name notranslate" translate="no">{SITE.name}</span>
          <p className="footer-tagline">{SITE.tagline}</p>
        </div>

        {/* Nav links */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <ul className="footer-links">
            {FOOTER_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social links */}
        <div className="footer-socials">
          {SOCIALS.filter(s => ["youtube", "instagram", "twitter", "spotify"].includes(s.icon)).map(s => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label={s.name}
            >
              {SOCIAL_LABELS[s.icon] || s.name}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <span className="footer-copy">
            © {year} <span className="notranslate" translate="no">{SITE.name}</span>
          </span>
          <span className="footer-sep">·</span>
          <span>{SITE.location}</span>
          <span className="footer-sep">·</span>
          <span>Historian · Author · YouTuber</span>
        </div>
      </div>
    </footer>
  );
}
