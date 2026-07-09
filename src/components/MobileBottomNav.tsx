import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Film, User } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/books", icon: BookOpen, label: "Books" },
  { path: "/articles", icon: Film, label: "Articles" },
  { path: "/about", icon: User, label: "About" },
];

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <style>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 998;
          background: rgba(var(--c-parchment-rgb, 245, 240, 232), 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid var(--c-border);
          padding: 0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom));
          justify-content: space-around;
          align-items: center;
        }
        [data-theme="dark"] .mobile-bottom-nav {
          background: rgba(10, 10, 10, 0.95);
          border-top-color: rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) {
          .mobile-bottom-nav { display: flex; }
          body { padding-bottom: 70px; }
        }
        .mobile-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: none;
          border: none;
          color: var(--c-ink-muted);
          font-size: 0.6rem;
          font-family: var(--font-sans);
          font-weight: 600;
          cursor: pointer;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          transition: all 0.2s;
          min-width: 48px;
          -webkit-tap-highlight-color: transparent;
        }
        .mobile-nav-btn.active {
          color: var(--c-terracotta);
        }
        .mobile-nav-btn:active {
          transform: scale(0.92);
        }
        .mobile-nav-btn svg {
          width: 22px;
          height: 22px;
        }
      `}</style>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            className={`mobile-nav-btn${isActive(item.path) ? " active" : ""}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
