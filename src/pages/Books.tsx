import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { BOOKS, BOOK_CATEGORIES } from "../data/content";
import { Book } from "../types";

const CATEGORY_COLORS: Record<string, string> = {
  kathi:       "#c5a55a",
  history:     "#8a7b5a",
  royals:      "#b5956a",
  battles:     "#7a6a5a",
  governance:  "#5a7a8a",
  heritage:    "#8a5a6a",
  epigraphy:   "#6a7a5a",
  essays:      "#7a5a8a",
  biography:   "#5a8a7a",
  genealogy:   "#8a7a5a",
  religion:    "#9a8a6a",
  literature:  "#6a8a8a",
  freedom:     "#7a8a6a",
  architecture:"#8a6a5a",
  society:     "#6a5a8a",
  institutional:"#5a6a8a",
};

const BG_COLORS: Record<string, string> = {
  kathi:       "#2a2218",
  history:     "#1f1e1a",
  royals:      "#221a10",
  battles:     "#1a1818",
  governance:  "#151c22",
  heritage:    "#221518",
  epigraphy:   "#181f15",
  essays:      "#1a1522",
  biography:   "#152220",
  genealogy:   "#1f1e15",
  religion:    "#222018",
  literature:  "#152222",
  freedom:     "#1a2218",
  architecture:"#221815",
  society:     "#181522",
  institutional:"#151822",
};

// ── Left progress rail ──────────────────────────────────────────────────────
function ProgressRail({ count, active, onSelect }: { count: number; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="sp-rail">
      <button className="sp-rail-back" onClick={() => onSelect(-1)}>←</button>
      <div className="sp-rail-ticks">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            className={`sp-rail-tick ${i === active ? "active" : ""}`}
            onClick={() => onSelect(i)}
            title={BOOKS[i]?.title}
          />
        ))}
      </div>
      <div className="sp-rail-logo">
        <span>PK</span>
      </div>
    </div>
  );
}

// ── Homepage-style spine listing ─────────────────────────────────────────────
function BookSpine({ book, index, onClick }: { book: Book; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const accent = CATEGORY_COLORS[book.category] || "#c5a55a";
  const bg = BG_COLORS[book.category] || "#1a1a1a";

  return (
    <motion.div
      ref={ref}
      className="sp-spine-card"
      style={{ "--sp-accent": accent, "--sp-bg": bg } as React.CSSProperties}
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      whileHover={{ scale: 1.012, transition: { duration: 0.25 } }}
    >
      <div className="sp-spine-inner">
        <div className="sp-spine-num">
          {String(index + 1).padStart(2, "0")}
        </div>
        {book.locSelected && (
          <div className="sp-spine-loc" title="Library of Congress">LOC</div>
        )}
        <div className="sp-spine-author">Dr. Praduman Khachar</div>
        <div className="sp-spine-title-wrap">
          <span className="sp-spine-title">{book.title}</span>
          {book.titleGu && <span className="sp-spine-titlegu">{book.titleGu}</span>}
        </div>
        <div className="sp-spine-year">{book.year || "—"}</div>
        <div className="sp-spine-cat">{BOOK_CATEGORIES[book.category] || book.category}</div>
        <div className="sp-spine-arrow">→</div>
      </div>
      <div className="sp-spine-accent-bar" />
    </motion.div>
  );
}

// ── Detail overlay (full Stripe Press style) ────────────────────────────────
function BookDetail({ book, allBooks, onClose, onNavigate }: {
  book: Book;
  allBooks: Book[];
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
}) {
  const idx = allBooks.indexOf(book);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // 3D tilt on cover hover
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleCoverMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - r.top) / r.height - 0.5) * 15;
    const y = ((e.clientX - r.left) / r.width - 0.5) * -15;
    setTilt({ x, y });
  };

  const accent = CATEGORY_COLORS[book.category] || "#c5a55a";
  const bg = BG_COLORS[book.category] || "#1a1a1a";

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, onNavigate]);

  return (
    <motion.div
      className="sp-detail-overlay"
      style={{ "--sp-accent": accent, "--sp-bg": bg, "--sp-bg-dim": bg + "cc" } as React.CSSProperties}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Scroll progress bar */}
      <motion.div className="sp-scroll-progress" style={{ scaleX }} />

      {/* Close */}
      <button className="sp-detail-close" onClick={onClose}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Left progress rail */}
      <ProgressRail count={allBooks.length} active={idx} onSelect={(i) => {
        if (i === -1) onClose();
        else {
          const delta = i - idx;
          if (delta !== 0) onNavigate(delta > 0 ? 1 : -1);
        }
      }} />

      {/* Keyboard nav buttons */}
      <div className="sp-detail-nav">
        {idx > 0 && (
          <button className="sp-nav-btn sp-nav-prev" onClick={() => onNavigate(-1)}>
            <span>←</span>
            <span className="sp-nav-label">{allBooks[idx - 1]?.title}</span>
          </button>
        )}
        {idx < allBooks.length - 1 && (
          <button className="sp-nav-btn sp-nav-next" onClick={() => onNavigate(1)}>
            <span className="sp-nav-label">{allBooks[idx + 1]?.title}</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div className="sp-detail-body" ref={scrollRef}>
        {/* Hero section */}
        <section className="sp-detail-hero">
          {/* Cover */}
          <motion.div
            className="sp-cover-wrap"
            onMouseMove={handleCoverMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            animate={{ rotateX: tilt.x, rotateY: tilt.y }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            style={{ perspective: 1200 }}
          >
            <motion.div
              className="sp-cover-3d"
              initial={{ scale: 0.85, rotateY: -20, opacity: 0 }}
              animate={{ scale: 1, rotateY: -8, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} className="sp-cover-img" />
              ) : (
                <div className="sp-cover-placeholder">
                  <div className="sp-cover-texture" />
                  <div className="sp-cover-content">
                    <span className="sp-cover-eyebrow">{BOOK_CATEGORIES[book.category] || book.category}</span>
                    <h2 className="sp-cover-title-gu">{book.titleGu || book.title}</h2>
                    <p className="sp-cover-title-en">{book.titleGu ? book.title : ""}</p>
                    <div className="sp-cover-footer">
                      <span>Dr. Praduman Khachar</span>
                      {book.year && <span>{book.year}</span>}
                    </div>
                  </div>
                </div>
              )}
              {/* Spine shadow */}
              <div className="sp-cover-spine" />
            </motion.div>
          </motion.div>

          {/* Info */}
          <div className="sp-detail-info">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="sp-detail-eyebrow">{BOOK_CATEGORIES[book.category] || book.category}</div>
              <h1 className="sp-detail-title">{book.title}</h1>
              {book.titleGu && <div className="sp-detail-titlegu">{book.titleGu}</div>}
              <div className="sp-detail-author">Dr. Praduman Khachar</div>

              {book.locSelected && (
                <div className="sp-loc-badge">
                  <span>🏛️</span> Selected by Library of Congress, USA
                </div>
              )}

              <p className="sp-detail-desc">
                {book.description || "A definitive scholarly record exploring the history, heritage, and cultural traditions of Saurashtra — one of Dr. Khachar's landmark contributions to Gujarat's archival legacy."}
              </p>

              {/* Specs grid */}
              <div className="sp-detail-specs">
                {book.isbn && (
                  <div className="sp-spec"><span className="sp-spec-label">ISBN</span><span>{book.isbn}</span></div>
                )}
                {book.pages && (
                  <div className="sp-spec"><span className="sp-spec-label">Pages</span><span>{book.pages}</span></div>
                )}
                {book.year && (
                  <div className="sp-spec"><span className="sp-spec-label">Year</span><span>{book.year}</span></div>
                )}
                {book.publisher && (
                  <div className="sp-spec"><span className="sp-spec-label">Publisher</span><span>{book.publisher}</span></div>
                )}
                {book.price && (
                  <div className="sp-spec"><span className="sp-spec-label">Price</span><span>{book.price}</span></div>
                )}
              </div>

              {/* Purchase links */}
              <div className="sp-purchase-links">
                <a href="#" className="sp-purchase-link">
                  <span>Purchase Directly</span>
                  <span className="sp-purchase-price">{book.price || "Contact"}</span>
                  <span className="sp-purchase-arrow">↗</span>
                </a>
                <a href="mailto:pkhachar@gmail.com" className="sp-purchase-link">
                  <span>Contact Author</span>
                  <span className="sp-purchase-price">pkhachar@gmail.com</span>
                  <span className="sp-purchase-arrow">↗</span>
                </a>
                {book.locSelected && (
                  <a href="https://catalog.loc.gov/" target="_blank" rel="noopener noreferrer" className="sp-purchase-link">
                    <span>Library of Congress Catalog</span>
                    <span className="sp-purchase-price">Archived</span>
                    <span className="sp-purchase-arrow">🏛️</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Endorsements / scrolling section */}
        <section className="sp-detail-endorsements">
          <motion.div
            className="sp-endorsement"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="sp-endorsement-divider" />
            <p className="sp-endorsement-text">
              "Dr. Khachar is the preeminent historian of the Kathiawar peninsula. His work on the 222 princely states is a masterpiece of archival detective work."
            </p>
            <div className="sp-endorsement-author">
              <strong>Gujarat Samachar</strong>
              <span>Leading Gujarati Daily Newspaper</span>
            </div>
          </motion.div>

          <motion.div
            className="sp-endorsement"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="sp-endorsement-divider" />
            <p className="sp-endorsement-text">
              "A stunning achievement in preservation. Dr. Khachar's bibliography is not just a list of books, but a map of a vanishing culture rendered permanent."
            </p>
            <div className="sp-endorsement-author">
              <strong>INTACH Gujarat</strong>
              <span>Indian National Trust for Art and Cultural Heritage</span>
            </div>
          </motion.div>

          {/* Next book teaser */}
          {idx < allBooks.length - 1 && (
            <motion.div
              className="sp-next-teaser"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => onNavigate(1)}
            >
              <span className="sp-next-label">Next in Collection</span>
              <div className="sp-next-title">{allBooks[idx + 1]?.title}</div>
              {allBooks[idx + 1]?.titleGu && (
                <div className="sp-next-titlegu">{allBooks[idx + 1].titleGu}</div>
              )}
              <div className="sp-next-arrow">↓ Continue</div>
            </motion.div>
          )}
        </section>
      </div>
    </motion.div>
  );
}

// ── Main Books Page ─────────────────────────────────────────────────────────
export default function BooksPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filtered = BOOKS.filter((b) => {
    const matchCategory = filter === "all" || b.category === filter;
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.titleGu && b.titleGu.includes(search));
    return matchCategory && matchSearch;
  });

  const categories = ["all", ...new Set(BOOKS.map((b) => b.category))];

  const openBook = (book: Book) => {
    const idx = filtered.indexOf(book);
    setSelectedIdx(idx);
    setSelectedBook(book);
  };

  const navigate = (dir: 1 | -1) => {
    const nextIdx = selectedIdx + dir;
    if (nextIdx >= 0 && nextIdx < filtered.length) {
      setSelectedIdx(nextIdx);
      setSelectedBook(filtered[nextIdx]);
    }
  };

  return (
    <main className="sp-page">
      {/* Header */}
      <header className="sp-header">
        <div className="sp-header-inner">
          <div className="sp-header-brand">
            <span className="sp-brand-mark">PK</span>
            <div>
              <div className="sp-brand-name">Dr. Praduman Khachar</div>
              <div className="sp-brand-sub">Ideas for Heritage</div>
            </div>
          </div>
          <div className="sp-header-stats">
            <span>33 Books</span>
            <span className="sp-stat-sep">·</span>
            <span>23 in LOC</span>
            <span className="sp-stat-sep">·</span>
            <span>30+ Years</span>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="sp-controls">
        <input
          type="search"
          className="sp-search"
          placeholder="Search bibliography..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="sp-filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`sp-filter-pill ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? "All" : BOOK_CATEGORIES[cat] || cat}
              {cat !== "all" && (
                <span className="sp-pill-count">{BOOKS.filter((b) => b.category === cat).length}</span>
              )}
            </button>
          ))}
        </div>
        <div className="sp-result-count">{filtered.length} {filtered.length === 1 ? "book" : "books"}</div>
      </div>

      {/* Spine listing */}
      <div className="sp-spine-list">
        {filtered.map((book, i) => (
          <BookSpine
            key={book.title}
            book={book}
            index={i}
            onClick={() => openBook(book)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="sp-empty">
            <p>No books matching "{search}"</p>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="sp-page-footer">
        <div className="sp-footer-stat"><span className="sp-footer-num">33</span><span>Books Published</span></div>
        <div className="sp-footer-stat"><span className="sp-footer-num">23</span><span>Library of Congress</span></div>
        <div className="sp-footer-stat"><span className="sp-footer-num">11</span><span>High Court Citations</span></div>
        <div className="sp-footer-stat"><span className="sp-footer-num">1997</span><span>First Publication</span></div>
      </div>

      {/* Book detail overlay */}
      <AnimatePresence>
        {selectedBook && (
          <BookDetail
            book={selectedBook}
            allBooks={filtered}
            onClose={() => setSelectedBook(null)}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
