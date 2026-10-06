/**
 * CommandPalette.tsx
 *
 * Global quick-search / navigation palette — press ⌘K (Mac) or Ctrl+K.
 * Searches page titles, nav routes, and video articles from the index.
 * Features: search history (localStorage), bookmarks tab.
 * Inspired by Chanhdai's keyboard-first dense UI approach.
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BOOKS, BOOK_CATEGORIES } from "../data/content";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { recordEvent } from "../hooks/useAnalytics";
import { downloadBookmarks } from "../lib/bookmarkExport";

// ─── Search History & Bookmarks ───────────────────────────────────────────────
const HISTORY_KEY = "pk-search-history";
const BOOKMARKS_KEY = "pk-bookmarks";

function getHistory(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(value) ? value.filter((q): q is string => typeof q === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}
function saveHistory(q: string) {
  if (!q.trim()) return;
  const prev = getHistory().filter((h) => h !== q);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...prev].slice(0, 5))); } catch { /* Storage may be disabled. */ }
}
function clearHistory() {
  try { localStorage.removeItem(HISTORY_KEY); } catch { /* Storage may be disabled. */ }
}

export type BookmarkItem = {
  id: string;
  title: string;
  type: "book" | "video";
};

export function getBookmarks(): BookmarkItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
      if (typeof item !== "string") return item;
      const book = BOOKS.find((b) => b.title === item);
      return book ? { id: book.slug || book.title.toLowerCase().replace(/ /g, "-"), title: book.title, type: "book" } : null;
    }).filter((item): item is BookmarkItem =>
      item && typeof item.id === "string" && item.id.length > 0 &&
      typeof item.title === "string" && (item.type === "book" || item.type === "video")
    );
  } catch {
    return [];
  }
}
export function toggleBookmark(item: BookmarkItem) {
  const prev = getBookmarks();
  const exists = prev.find((b) => b.id === item.id && b.type === item.type);
  const next = exists
    ? prev.filter((b) => b.id !== item.id || b.type !== item.type)
    : [item, ...prev];
  try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next)); } catch { return; }
  window.dispatchEvent(new Event("pk-bookmarks-changed"));
}

export function saveBookBookmarks(titles: string[]) {
  const videos = getBookmarks().filter((item) => item.type === "video");
  const books: BookmarkItem[] = BOOKS.filter((book) => titles.includes(book.title)).map((book) => ({
    id: book.slug || book.title.toLowerCase().replace(/ /g, "-"), title: book.title, type: "book",
  }));
  try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...books, ...videos])); } catch { return; }
  window.dispatchEvent(new Event("pk-bookmarks-changed"));
}
export function isBookmarked(id: string): boolean {
  return getBookmarks().some((b) => b.id === id);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface CmdItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;
  action: () => void;
  keywords?: string;
  bookmark?: BookmarkItem;
}

const NAV_ITEMS: Omit<CmdItem, "action">[] = [
  { id: "home", icon: "🏠", label: "Home", keywords: "main index" },
  {
    id: "about",
    icon: "👤",
    label: "About",
    keywords: "bio biography professor",
  },
  {
    id: "books",
    icon: "📚",
    label: "Books",
    keywords: "publications authored",
  },
  {
    id: "articles",
    icon: "📺",
    label: "Articles",
    keywords: "videos youtube media",
  },
  {
    id: "media",
    icon: "🎙",
    label: "Media",
    keywords: "channel instagram social",
  },
  { id: "explore", icon: "🔍", label: "Explore", keywords: "search semantic" },
  {
    id: "press",
    icon: "📰",
    label: "Press",
    keywords: "newspaper recognition",
  },
  {
    id: "labs",
    icon: "🧪",
    label: "Labs",
    keywords: "tools extensions chrome",
  },
  {
    id: "reading",
    icon: "📖",
    label: "Reading Room",
    keywords: "books recommendations library",
  },
  {
    id: "topics",
    icon: "🗂️",
    label: "Topics",
    keywords: "clusters research subjects",
  },
  {
    id: "timeline",
    icon: "⏳",
    label: "Timeline",
    keywords: "heritage history milestones",
  },
  { id: "map", icon: "🗺️", label: "Map", keywords: "gujarat places locations" },
  {
    id: "citations",
    icon: "📎",
    label: "Citations",
    keywords: "apa mla reference cite",
  },
];

type VideoResult = {
  id: string;
  title: string;
  thumbnail?: string;
  publishedAt?: string;
};
type TabId = "search" | "saved";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [tab, setTab] = useState<TabId>("search");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { recent } = useRecentlyViewed();

  // Load video index once
  useEffect(() => {
    fetch("/data/videos.json")
      .then((r) => r.json())
      .then((d) =>
        setVideos(
          (d.videos || []).slice(0, 600).map((v: any) => ({
            id: v.id,
            title: v.title,
            thumbnail: v.thumbnailMq || v.thumbnail,
            publishedAt: v.publishedAt,
          })),
        ),
      )
      .catch(() => {});
  }, []);

  // Toggle on ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) recordEvent("search_open", "cmd_k");
          return !o;
        });
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus + reset when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      setQuery("");
      setSelectedIdx(0);
      setTab("search");
      setHistory(getHistory());
      setBookmarks(getBookmarks());
    }
  }, [open]);

  // Sync bookmarks when they change from outside
  useEffect(() => {
    const sync = () => setBookmarks(getBookmarks());
    window.addEventListener("pk-bookmarks-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pk-bookmarks-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Build nav action items
  const navItems: CmdItem[] = NAV_ITEMS.map((n) => ({
    ...n,
    action: () => {
      navigate(n.id === "home" ? "/" : `/${n.id}`);
      close();
    },
  }));

  const q = query.toLowerCase().trim();
  const filteredNav = q
    ? navItems.filter(
        (i) =>
          i.label.toLowerCase().includes(q) || (i.keywords || "").includes(q),
      )
    : navItems;

  const filteredVideos: CmdItem[] =
    q.length > 1
      ? videos
          .filter((v) => v.title.toLowerCase().includes(q))
          .slice(0, 6)
          .map((v) => ({
            id: `v-${v.id}`,
            bookmark: { id: v.id, title: v.title, type: "video" },
            icon: "▶",
            label: v.title,
            sublabel:
              v.publishedAt && !v.publishedAt.startsWith("NA")
                ? new Date(v.publishedAt).getFullYear().toString()
                : undefined,
            action: () => {
              saveHistory(query);
              navigate(`/articles/${v.id}`);
              close();
            },
          }))
      : [];

  const filteredBooks: CmdItem[] = q
    ? BOOKS.filter((b) => {
        const ql = query.toLowerCase();
        return (
          b.title.toLowerCase().includes(ql) ||
          (b.titleGu && b.titleGu.includes(query)) ||
          b.category.toLowerCase().includes(ql)
        );
      })
        .slice(0, 5)
        .map((b) => ({
          id: `book-${b.title}`,
          bookmark: { id: b.slug || b.title.toLowerCase().replace(/ /g, "-"), title: b.title, type: "book" },
          label: b.title,
          sublabel: `${BOOK_CATEGORIES[b.category] || b.category} · ${b.year || ""}`,
          icon: "📖",
          action: () => {
            navigate(
              `/books/${b.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            );
            close();
          },
          keywords: `book ${b.category} ${b.year || ""}`,
        }))
    : [];

  const recentItems: CmdItem[] = !q
    ? recent.map((r) => ({
        id: `recent-${r.slug}`,
        label: r.title,
        sublabel: `${r.category} · recently viewed`,
        icon: "🕐",
        action: () => navigate(`/books/${r.slug}`),
        keywords: `recent ${r.category}`,
      }))
    : [];

  const allItems = [
    ...recentItems,
    ...filteredNav,
    ...filteredVideos,
    ...filteredBooks,
  ];

  const bookmarkItems: CmdItem[] = bookmarks.map((b) => ({
    id: `bk-${b.type}-${b.id}`,
    icon: b.type === "video" ? "▶" : "📖",
    label: b.title,
    sublabel: b.type === "video" ? "Video" : "Book",
    action: () => {
      if (b.type === "video") navigate(`/articles/${b.id}`);
      else navigate(`/books/${b.id}`);
      close();
    },
  }));

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const items = tab === "search" ? allItems : bookmarkItems;
    const onKey = (e: KeyboardEvent) => {
      const button = e.target instanceof HTMLElement ? e.target.closest("button") : null;
      // Save, export and tab buttons retain their native activation behavior.
      if (button && (e.key === "Enter" || e.key === " ")) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!items.length) return;
        e.preventDefault();
        const next = Math.max(0, Math.min(selectedIdx + (e.key === "ArrowDown" ? 1 : -1), items.length - 1));
        setSelectedIdx(next);
        // After leaving a tab/control, Enter should open the highlighted result.
        if (button) button.closest(".cmd-panel")
          ?.querySelector<HTMLButtonElement>(`[data-cmd-index="${next}"]`)?.focus();
      }
      if (e.key === "Enter" && items[selectedIdx]) {
        e.preventDefault();
        items[selectedIdx].action();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, allItems, bookmarkItems, selectedIdx, tab]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query, tab]);

  if (!open) return null;

  return (
    <div
      className="cmd-overlay"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="cmd-panel"
        role="dialog"
        aria-label="Command palette"
        aria-modal="true"
      >
        {/* Tabs */}
        <div className="cmd-tabs">
          <button
            className={`cmd-tab${tab === "search" ? " active" : ""}`}
            onClick={() => setTab("search")}
          >
            🔍 Search
          </button>
          <button
            className={`cmd-tab${tab === "saved" ? " active" : ""}`}
            onClick={() => setTab("saved")}
          >
            🔖 Saved{" "}
            {bookmarks.length > 0 && (
              <span className="cmd-tab-badge">{bookmarks.length}</span>
            )}
          </button>
        </div>

        {tab === "search" && (
          <>
            {/* Input */}
            <div className="cmd-input-wrap">
              <svg
                className="cmd-search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                className="cmd-input"
                type="text"
                placeholder="Search pages, videos, books…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="cmd-esc-hint">ESC</kbd>
            </div>

            <div className="cmd-results">
              {/* Recent searches — shown when input is empty */}
              {!q && history.length > 0 && (
                <div className="cmd-group">
                  <div className="cmd-group-label cmd-group-label-row">
                    <span>Recent Searches</span>
                    <button
                      className="cmd-clear-history"
                      onClick={() => {
                        clearHistory();
                        setHistory([]);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  {history.map((h, i) => (
                    <button
                      key={h}
                      className={`cmd-item${selectedIdx === i ? " selected" : ""}`}
                      onClick={() => setQuery(h)}
                      onMouseEnter={() => setSelectedIdx(i)}
                    >
                      <span
                        className="cmd-item-icon"
                        style={{ fontSize: "0.8rem" }}
                      >
                        🕐
                      </span>
                      <span className="cmd-item-label">{h}</span>
                      <span
                        className="cmd-item-arrow"
                        style={{ fontSize: "0.7rem", opacity: 0.5 }}
                      >
                        search
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {!q && recentItems.length > 0 && (
                <div className="cmd-group">
                  <div className="cmd-group-label">🕐 Recently Viewed</div>
                  {recentItems.map((item, i) => (
                    <button
                      key={item.id}
                      className={`cmd-item${selectedIdx === i ? " selected" : ""}`}
                      data-cmd-index={i}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIdx(i)}
                    >
                      <span className="cmd-item-icon">🕐</span>
                      <span className="cmd-item-label">{item.label}</span>
                      {item.sublabel && (
                        <span className="cmd-item-sub">{item.sublabel}</span>
                      )}
                      <span className="cmd-item-arrow">↵</span>
                    </button>
                  ))}
                </div>
              )}

              {filteredNav.length > 0 && (
                <div className="cmd-group">
                  <div className="cmd-group-label">Pages</div>
                  {filteredNav.map((item, i) => {
                    const idx = recentItems.length + i;
                    return (
                      <button
                        key={item.id}
                        className={`cmd-item${selectedIdx === idx ? " selected" : ""}`}
                        data-cmd-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIdx(idx)}
                      >
                        <span className="cmd-item-icon">{item.icon}</span>
                        <span className="cmd-item-label">{item.label}</span>
                        <span className="cmd-item-arrow">↵</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredVideos.length > 0 && (
                <div className="cmd-group">
                  <div className="cmd-group-label">Videos</div>
                  {filteredVideos.map((item, i) => {
                    const idx = recentItems.length + filteredNav.length + i;
                    return (
                      <div key={item.id} className="cmd-result-row">
                      <button
                        className={`cmd-item${selectedIdx === idx ? " selected" : ""}`}
                        data-cmd-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIdx(idx)}
                      >
                        <span
                          className="cmd-item-icon"
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--c-terracotta)",
                          }}
                        >
                          ▶
                        </span>
                        <span className="cmd-item-label">{item.label}</span>
                        {item.sublabel && (
                          <span className="cmd-item-sub">{item.sublabel}</span>
                        )}
                        <span className="cmd-item-arrow">↵</span>
                      </button>
                      {item.bookmark && <button
                        type="button"
                        className="cmd-save"
                        aria-label={`Save ${item.label}`}
                        aria-pressed={bookmarks.some((b) => b.id === item.bookmark!.id && b.type === item.bookmark!.type)}
                        onClick={() => toggleBookmark(item.bookmark!)}
                      >
                        {bookmarks.some((b) => b.id === item.bookmark!.id && b.type === item.bookmark!.type) ? "Saved" : "Save"}
                      </button>}
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredBooks.length > 0 && (
                <div className="cmd-group">
                  <div className="cmd-group-label">📚 Books</div>
                  {filteredBooks.map((item, i) => {
                    const idx =
                      recentItems.length +
                      filteredNav.length +
                      filteredVideos.length +
                      i;
                    return (
                      <div key={item.id} className="cmd-result-row">
                      <button
                        className={`cmd-item${selectedIdx === idx ? " selected" : ""}`}
                        data-cmd-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIdx(idx)}
                      >
                        <span className="cmd-item-icon">📖</span>
                        <span className="cmd-item-label">{item.label}</span>
                        {item.sublabel && (
                          <span className="cmd-item-sub">{item.sublabel}</span>
                        )}
                        <span className="cmd-item-arrow">↵</span>
                      </button>
                      {item.bookmark && <button
                        type="button"
                        className="cmd-save"
                        aria-label={`Save ${item.label}`}
                        aria-pressed={bookmarks.some((b) => b.id === item.bookmark!.id && b.type === item.bookmark!.type)}
                        onClick={() => toggleBookmark(item.bookmark!)}
                      >
                        {bookmarks.some((b) => b.id === item.bookmark!.id && b.type === item.bookmark!.type) ? "Saved" : "Save"}
                      </button>}
                      </div>
                    );
                  })}
                </div>
              )}

              {allItems.length === 0 && q && (
                <div className="cmd-empty">No results for "{query}"</div>
              )}
            </div>
          </>
        )}

        {tab === "saved" && (
          <div className="cmd-results">
            {bookmarkItems.length === 0 ? (
              <div
                className="cmd-empty"
                style={{ padding: "2.5rem 1rem", textAlign: "center" }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                  🔖
                </div>
                <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                  No saved items yet
                </div>
                <div style={{ fontSize: "0.78rem", opacity: 0.6 }}>
                  Bookmark books and videos to find them here instantly.
                </div>
              </div>
            ) : (
              <div className="cmd-group">
                <div className="cmd-group-label">
                  Saved Items ({bookmarks.length})
                </div>
                <button type="button" className="saved-export" onClick={() => downloadBookmarks(bookmarks)}>
                  Export saved items
                </button>
                {bookmarkItems.map((item, i) => (
                  <button
                    key={item.id}
                    className={`cmd-item${selectedIdx === i ? " selected" : ""}`}
                    data-cmd-index={i}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIdx(i)}
                  >
                    <span
                      className="cmd-item-icon"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--c-terracotta)",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="cmd-item-label">{item.label}</span>
                    {item.sublabel && (
                      <span className="cmd-item-sub">{item.sublabel}</span>
                    )}
                    <span className="cmd-item-arrow">↵</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="cmd-footer">
          <span>
            <kbd>↑↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </div>
      </div>

      <style>{`
        .cmd-tabs {
          display: flex;
          border-bottom: 1px solid var(--c-border-light);
          padding: 0 0.5rem;
          gap: 0;
        }
        .cmd-tab {
          background: none;
          border: none;
          padding: 0.65rem 1rem;
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--c-ink-muted);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cmd-tab.active {
          color: var(--c-terracotta);
          border-bottom-color: var(--c-terracotta);
        }
        .cmd-tab-badge {
          background: var(--c-terracotta);
          color: white;
          border-radius: 10px;
          padding: 1px 6px;
          font-size: 0.65rem;
          font-weight: 700;
        }
        .cmd-group-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cmd-clear-history {
          background: none;
          border: none;
          font-size: 0.7rem;
          color: var(--c-ink-muted);
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          transition: all 0.2s;
          font-family: var(--font-body);
        }
        .cmd-clear-history:hover {
          background: var(--c-border-light);
          color: var(--c-terracotta);
        }
      `}</style>
    </div>
  );
}
