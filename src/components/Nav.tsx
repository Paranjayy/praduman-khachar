import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Moon, Sun, Globe } from "lucide-react";
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
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const syncLang = () => {
      const cookies = document.cookie.split('; ');
      const googtrans = cookies.find(c => c.startsWith('googtrans='));
      if (googtrans) {
        const val = googtrans.split('=')[1].split('/').pop();
        if (val && ['en', 'gu', 'hi'].includes(val)) {
          setCurrentLang(val);
          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (select && select.value !== val) {
            select.value = val;
            select.dispatchEvent(new Event('change'));
          }
        }
      }
    };
    syncLang();
    const interval = setInterval(syncLang, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setCurrentLang(lang);
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
    document.cookie = `googtrans=/en/${lang === 'en' ? 'en' : lang}; path=/; domain=${window.location.hostname}`;
    if (lang === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      window.location.reload();
    }
  };

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

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const links = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Books", to: "/books" },
    { label: "Media", to: "/media" },
    { label: "Explore", to: "/explore" },
    ...(!CONFIG.HIDE_ARTICLES ? [{ label: "Articles", to: "/articles" }] : []),
    { label: "Reading", to: "/reading" },
    { label: "Topics", to: "/topics" },
    { label: "Press", to: "/press" },
    { label: "Timeline", to: "/timeline" },
    { label: "Citations", to: "/citations" },
    { label: "Labs", to: "/labs" },
  ];

  const handleSearchClick = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  return (
    <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <div
        className="scroll-progress-bar"
        style={{
          position: "absolute", top: 0, left: 0, height: "2.5px",
          background: "var(--c-terracotta)", width: `${scrollProgress}%`,
          transition: "width 0.1s ease-out", zIndex: 1000
        }}
      />
      
      <div className="nav-container">
        <Link to="/" className="nav-brand notranslate" translate="no" style={{ zIndex: 1001 }}>
          {SITE.name}
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links desktop-only">
          {links.slice(0, 5).map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={pathname === link.to ? "active" : ""}>
                {link.label}
              </Link>
            </li>
          ))}
          {links.length > 5 && (
            <li className="nav-more-item" ref={moreRef}>
              <button 
                className={`nav-more-trigger${moreOpen ? ' active' : ''}`}
                onClick={() => setMoreOpen(!moreOpen)}
              >
                More ▾
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.ul 
                    className="nav-more-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {links.slice(5).map(link => (
                      <li key={link.to}>
                        <Link to={link.to} className={pathname === link.to ? "active" : ""}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          <button className="nav-search-btn" onClick={handleSearchClick} aria-label="Search">
            <Search size={18} />
            <span className="nav-search-kbd">⌘K</span>
          </button>
          
          <div className="lang-switcher-wrap">
            <Globe size={16} />
            <select
              className="lang-select-premium"
              value={currentLang}
              onChange={handleLangChange}
            >
              <option value="en">EN</option>
              <option value="gu">ગુજરાતી</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          <button className="theme-toggle" onClick={toggle} aria-label="Toggle Theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="nav-toggle-premium" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="mobile-nav-content">
              <motion.ul 
                className="mobile-nav-links"
                initial="closed"
                animate="open"
                variants={{
                  open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
                  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                }}
              >
                {links.map((link) => (
                  <motion.li
                    key={link.to}
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 }
                    }}
                  >
                    <Link
                      to={link.to}
                      className={pathname === link.to ? "active" : ""}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div 
                className="mobile-nav-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="mobile-nav-site-info">© {new Date().getFullYear()} {SITE.name}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-container { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          width: 100%; 
          max-width: var(--max-w); 
          margin: 0 auto;
          padding: 0 var(--space-lg);
          min-height: 4rem;
        }
        .desktop-only { display: flex; list-style: none; gap: 0.5rem; align-items: center; }
        .nav-toggle-premium { display: none; background: none; border: none; cursor: pointer; color: var(--c-ink); padding: 5px; }
        
        .nav-more-item { position: relative; display: flex; align-items: center; }
        .nav-more-trigger {
          background: none;
          border: none;
          color: var(--c-ink-soft);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0.5rem 0.75rem;
          transition: all 0.3s ease;
          border-radius: 6px;
        }
        .nav-more-trigger:hover, .nav-more-trigger.active { color: var(--c-terracotta); background: oklch(0.5 0 0 / 0.03); }
        
        .nav-more-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--c-parchment);
          border: 1px solid var(--c-border);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          list-style: none;
          padding: 8px;
          min-width: 180px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .nav-more-dropdown a {
          display: block;
          padding: 10px 16px;
          color: var(--c-ink-soft);
          text-decoration: none;
          font-size: 0.85rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .nav-more-dropdown a:hover {
          background: var(--c-border-light);
          color: var(--c-ink);
        }
        
        .nav-more-dropdown a.active {
          color: var(--c-terracotta);
          background: color-mix(in oklch, var(--c-terracotta) 10%, transparent);
        }

        .lang-switcher-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--c-border);
          padding: 0 12px;
          height: 36px; /* Match theme-toggle height */
          border-radius: 20px;
          color: var(--c-ink-soft);
          transition: all 0.3s ease;
        }
        
        .lang-switcher-wrap:hover {
          border-color: var(--c-terracotta);
          color: var(--c-terracotta);
        }
        
        .lang-select-premium {
          background: none;
          border: none;
          color: inherit;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          padding-right: 4px;
        }
        
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: color-mix(in oklch, var(--c-parchment) 95%, transparent);
          backdrop-filter: blur(20px) saturate(1.5);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          padding-top: 6rem;
        }
        
        .mobile-nav-content {
          padding: 0 var(--space-xl);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .mobile-nav-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .mobile-nav-links a {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--c-ink-muted);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .mobile-nav-links a.active {
          color: var(--c-terracotta);
        }
        
        .mobile-nav-footer {
          margin-top: auto;
          padding-bottom: 3rem;
          border-top: 1px solid var(--c-border-light);
          padding-top: 2rem;
        }
        
        .mobile-nav-site-info {
          font-family: var(--font-body);
          font-size: 0.8rem;
          color: var(--c-ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        @media (max-width: 900px) {
          .desktop-only { display: none; }
          .nav-toggle-premium { display: block; }
          .nav-search-kbd { display: none; }
        }
        
        @media (max-width: 600px) {
           .nav-brand { font-size: 0.9rem; }
           .lang-switcher-wrap { padding: 4px 6px; }
           .lang-select-premium { font-size: 0.7rem; }
           .mobile-nav-links a { font-size: 1.8rem; }
        }
      `}</style>
    </nav>
  );
}
