import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useScrolled } from "../hooks/useAnimations";
import { useTheme } from "../hooks/useTheme";
import { SITE } from "../data/content";
import { CONFIG } from "../config";

export default function Nav() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { pathname } = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const moreRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight <= 0) return;
      setScrollProgress((totalScroll / windowHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [moreOpen]);

  // Close everything on route change
  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  const primaryLinks = [
    ["Home", "/"],
    ["About", "/about"],
    ["Books", "/books"],
    ["Media", "/media"],
    ["Articles", "/articles"],
    ["Explore", "/explore"],
  ];

  const secondaryLinks = [
    ...(!CONFIG.HIDE_WRITINGS ? [["Writings", "/writings"]] : []),
    ["Press", "/press"],
    ["Labs", "/labs"],
  ];

  const isSecondaryActive = secondaryLinks.some(([, to]) => pathname === to);

  return (
    <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <div
        className="scroll-progress-bar"
        style={{
          position: "absolute", top: 0, left: 0, height: "2px",
          background: "var(--c-terracotta)", width: `${scrollProgress}%`,
          transition: "width 0.1s ease-out", zIndex: 1000
        }}
      />
      <Link to="/" className="nav-brand notranslate" translate="no" onClick={() => setOpen(false)}>
        {SITE.name}
      </Link>

      <ul className={`nav-links${open ? " open" : ""}`}>
        {primaryLinks.map(([label, to]) => (
          <li key={to}>
            <Link
              to={to}
              className={pathname === to ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          </li>
        ))}

        {/* More dropdown — click-based with React state */}
        {secondaryLinks.length > 0 && (
          <li ref={moreRef} className={`nav-more-item${moreOpen ? " open" : ""}`}>
            <button
              className={`nav-more-trigger${isSecondaryActive ? " active" : ""}`}
              onClick={() => setMoreOpen(prev => !prev)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              More {moreOpen ? "▴" : "▾"}
            </button>
            {moreOpen && (
              <ul className="nav-more-dropdown" role="menu">
                {secondaryLinks.map(([label, to]) => (
                  <li key={to} role="none">
                    <Link
                      to={to}
                      role="menuitem"
                      className={pathname === to ? "active" : ""}
                      onClick={() => { setOpen(false); setMoreOpen(false); }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}

        {/* Mobile: secondary links shown inline when hamburger is open */}
        {open && secondaryLinks.map(([label, to]) => (
          <li key={`mob-${to}`} className="nav-mobile-secondary">
            <Link
              to={to}
              className={pathname === to ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        <select
          className="lang-select"
          onChange={(e) => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (select) {
              select.value = e.target.value;
              select.dispatchEvent(new Event('change'));
            }
          }}
          style={{
            background: 'transparent',
            border: '1px solid var(--c-border)',
            color: 'var(--c-ink-soft)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            marginRight: '0.5rem'
          }}
        >
          <option value="en">English</option>
          <option value="gu">ગુજરાતી (Gujarati)</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
        <button
          className="theme-toggle"
          onClick={toggle}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Light mode" : "Dark mode"}
        >
          {dark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
