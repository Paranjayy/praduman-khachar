/**
 * CommandPalette.tsx
 *
 * Global quick-search / navigation palette — press ⌘K (Mac) or Ctrl+K.
 * Searches page titles, nav routes, and video articles from the index.
 * Inspired by Chanhdai's keyboard-first dense UI approach.
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface CmdItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;
  action: () => void;
  keywords?: string;
}

const NAV_ITEMS: Omit<CmdItem, "action">[] = [
  { id: "home",     icon: "🏠", label: "Home",          keywords: "main index" },
  { id: "about",    icon: "👤", label: "About",         keywords: "bio biography professor" },
  { id: "books",    icon: "📚", label: "Books",         keywords: "publications authored" },
  { id: "articles", icon: "📺", label: "Articles",      keywords: "videos youtube media" },
  { id: "media",    icon: "🎙", label: "Media",         keywords: "channel instagram social" },
  { id: "explore",  icon: "🔍", label: "Explore",       keywords: "search semantic" },
  { id: "press",    icon: "📰", label: "Press",         keywords: "newspaper recognition" },
  { id: "labs",     icon: "🧪", label: "Labs",          keywords: "tools extensions chrome" },
];

type VideoResult = { id: string; title: string; thumbnail?: string; publishedAt?: string };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load video index once
  useEffect(() => {
    fetch("/data/videos.json")
      .then(r => r.json())
      .then(d => setVideos((d.videos || []).slice(0, 600).map((v: any) => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnailMq || v.thumbnail,
        publishedAt: v.publishedAt,
      }))))
      .catch(() => {});
  }, []);

  // Toggle on ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      setQuery("");
      setSelectedIdx(0);
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  // Build nav action items
  const navItems: CmdItem[] = NAV_ITEMS.map(n => ({
    ...n,
    action: () => { navigate(n.id === "home" ? "/" : `/${n.id}`); close(); }
  }));

  // Filter
  const q = query.toLowerCase().trim();
  const filteredNav = q
    ? navItems.filter(i => i.label.toLowerCase().includes(q) || (i.keywords || "").includes(q))
    : navItems;

  const filteredVideos: CmdItem[] = q.length > 1
    ? videos
        .filter(v => v.title.toLowerCase().includes(q))
        .slice(0, 6)
        .map(v => ({
          id: `v-${v.id}`,
          icon: "▶",
          label: v.title,
          sublabel: v.publishedAt && !v.publishedAt.startsWith("NA")
            ? new Date(v.publishedAt).getFullYear().toString()
            : undefined,
          action: () => { navigate(`/articles/${v.id}`); close(); }
        }))
    : [];

  const allItems = [...filteredNav, ...filteredVideos];

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, allItems.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && allItems[selectedIdx]) { allItems[selectedIdx].action(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, allItems, selectedIdx]);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={e => e.target === e.currentTarget && close()}>
      <div className="cmd-panel" role="dialog" aria-label="Command palette" aria-modal="true">
        {/* Input */}
        <div className="cmd-input-wrap">
          <svg className="cmd-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className="cmd-input"
            type="text"
            placeholder="Search pages, videos…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="cmd-esc-hint">ESC</kbd>
        </div>

        {/* Results */}
        <div className="cmd-results">
          {filteredNav.length > 0 && (
            <div className="cmd-group">
              <div className="cmd-group-label">Pages</div>
              {filteredNav.map((item, i) => (
                <button
                  key={item.id}
                  className={`cmd-item${selectedIdx === i ? " selected" : ""}`}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIdx(i)}
                >
                  <span className="cmd-item-icon">{item.icon}</span>
                  <span className="cmd-item-label">{item.label}</span>
                  <span className="cmd-item-arrow">↵</span>
                </button>
              ))}
            </div>
          )}

          {filteredVideos.length > 0 && (
            <div className="cmd-group">
              <div className="cmd-group-label">Videos</div>
              {filteredVideos.map((item, i) => {
                const idx = filteredNav.length + i;
                return (
                  <button
                    key={item.id}
                    className={`cmd-item${selectedIdx === idx ? " selected" : ""}`}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIdx(idx)}
                  >
                    <span className="cmd-item-icon" style={{ fontSize: "0.75rem", color: "var(--c-terracotta)" }}>▶</span>
                    <span className="cmd-item-label">{item.label}</span>
                    {item.sublabel && <span className="cmd-item-sub">{item.sublabel}</span>}
                    <span className="cmd-item-arrow">↵</span>
                  </button>
                );
              })}
            </div>
          )}

          {allItems.length === 0 && q && (
            <div className="cmd-empty">No results for "{query}"</div>
          )}
        </div>

        <div className="cmd-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
