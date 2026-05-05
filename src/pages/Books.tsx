import { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "../hooks/useTheme";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { LayoutGrid, List, Columns, BookOpen, ChevronDown } from "lucide-react";
import { BOOKS, BOOK_CATEGORIES } from "../data/content";
import { Book } from "../types";
import { FlipBookPortal } from "../components/FlipBookPortal";

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

// ── TOC Rail ────────────────────────────────────────────────────────────────
function ProgressRail({ 
  books, 
  activeIdx, 
  onJump 
}: { 
  books: Book[]; 
  activeIdx: number; 
  onJump: (i: number) => void 
}) {
  return (
    <div className="sp-rail">
      <button className="sp-rail-back" onClick={() => onJump(-1)}>←</button>
      <div className="sp-rail-ticks">
        {books.map((book, i) => (
          <div key={i} className="sp-rail-tick-wrapper">
            <button
              className={`sp-rail-tick ${i === activeIdx ? "active" : ""}`}
              onClick={() => onJump(i)}
            />
            <div className="sp-rail-tooltip">{book.title}</div>
          </div>
        ))}
      </div>
      <div className="sp-rail-logo">
        <span>PK</span>
      </div>
    </div>
  );
}

// ── 3D Interactive Book Cover ───────────────────────────────────────────────
function InteractiveCover({ book, index }: { book: Book; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [0, 500], [15, -15]));
  const rotateY = useSpring(useTransform(x, [0, 500], [-15, 15]));

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const handleLeave = () => {
    x.set(250);
    y.set(250);
  };

  const accent = book.themeColor || CATEGORY_COLORS[book.category] || "#c5a55a";

  return (
    <motion.div
      className="sp-cover-wrap goated"
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, perspective: 1500 }}
    >
      <motion.div 
        className="sp-cover-3d"
        initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
        whileInView={{ scale: 1, opacity: 1, rotateY: -8 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} className="sp-cover-img" />
        ) : (
          <div className="sp-cover-placeholder">
            <div className="sp-cover-texture" />
            <div className="sp-cover-content">
              <span className="sp-cover-eyebrow">{BOOK_CATEGORIES[book.category]}</span>
              <h2 className="sp-cover-title-gu">{book.titleGu || book.title}</h2>
              <p className="sp-cover-title-en">{book.titleGu ? book.title : ""}</p>
              <div className="sp-cover-footer">
                <span>Dr. Praduman Khachar</span>
                {book.year && <span>{book.year}</span>}
              </div>
            </div>
          </div>
        )}
        <div className="sp-cover-spine" />
        {/* Glow effect */}
        <motion.div 
          className="sp-cover-glow" 
          style={{ 
            opacity: useTransform(x, [0, 500], [0.3, 0]),
            background: `radial-gradient(circle at center, ${accent}33, transparent)`
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Spine View Item ──────────────────────────────────────────────────────────
function BookSpine({ book, index, onClick }: { book: Book; index: number; onClick: () => void }) {
  const { theme } = useTheme();
  const accent = book.themeColor || CATEGORY_COLORS[book.category] || "#c5a55a";
  const bg = theme === 'dark' 
    ? (BG_COLORS[book.category] || "#1a1a1a")
    : "#ffffff";
    
  return (
    <motion.div
      className="sp-spine-card"
      style={{ "--sp-accent": accent, "--sp-bg": bg } as React.CSSProperties}
      onClick={onClick}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.02, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="sp-spine-inner">
        <div className="sp-spine-num">{String(index + 1).padStart(2, "0")}</div>
        <div className="sp-spine-loc">LOC</div>
        <div className="sp-spine-author">Dr. Praduman Khachar</div>
        <div className="sp-spine-title-wrap">
          <div className="sp-spine-title">{book.title}</div>
          {book.titleGu && <div className="sp-spine-titlegu">{book.titleGu}</div>}
        </div>
        <div className="sp-spine-cat">{BOOK_CATEGORIES[book.category]}</div>
        <div className="sp-spine-year">{book.year || "—"}</div>
        <div className="sp-spine-arrow">→</div>
      </div>
    </motion.div>
  );
}

// ── Card View Item ──────────────────────────────────────────────────────────
function BookCard({ book, index, onClick }: { book: Book; index: number; onClick: () => void }) {
  return (
    <div className="sp-card" onClick={onClick}>
      <div className="sp-card-visual">
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} />
        ) : (
          <div className="sp-card-placeholder" style={{ background: book.themeColor || CATEGORY_COLORS[book.category] }}>
             <span>{book.title.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="sp-card-body">
        <div className="sp-card-meta">
          <span className="sp-card-cat">{BOOK_CATEGORIES[book.category]}</span>
          {book.year && <span className="sp-card-year">{book.year}</span>}
        </div>
        <h3 className="sp-card-title">{book.title}</h3>
      </div>
    </div>
  );
}

// ── Section Item within Endless Scroll Detail ───────────────────────────────
function DetailSection({ 
  book, 
  index, 
  onVisible,
  setPreviewBook
}: { 
  book: Book; 
  index: number; 
  onVisible: (i: number) => void;
  setPreviewBook: (b: { title: string, pages: string[] } | null) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) onVisible(index); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, onVisible]);

  const { theme } = useTheme();
  const accent = book.themeColor || CATEGORY_COLORS[book.category] || "#c5a55a";
  const bg = theme === 'dark' 
    ? (BG_COLORS[book.category] || "#1a1a1a")
    : "var(--c-parchment)";

  return (
    <section 
      ref={sectionRef}
      className="sp-detail-section"
      id={`book-${index}`}
      style={{ 
        "--sp-accent": accent, 
        "--sp-bg": bg, 
        "--sp-bg-dim": bg + "cc",
        fontFamily: book.fontFamily || "var(--font-serif)"
      } as React.CSSProperties}
    >
      <div className="sp-detail-hero">
        <InteractiveCover book={book} index={index} />

        <div className="sp-detail-info">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="sp-detail-eyebrow">{BOOK_CATEGORIES[book.category]}</div>
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

            <div className="sp-detail-specs">
              {book.isbn && <div className="sp-spec"><span className="sp-spec-label">ISBN</span><span>{book.isbn}</span></div>}
              {book.pages && <div className="sp-spec"><span className="sp-spec-label">Pages</span><span>{book.pages}</span></div>}
              {book.year && <div className="sp-spec"><span className="sp-spec-label">Year</span><span>{book.year}</span></div>}
              {book.publisher && <div className="sp-spec"><span className="sp-spec-label">Publisher</span><span>{book.publisher}</span></div>}
            </div>

            <div className="sp-purchase-links">
              <button 
                className="sp-purchase-link preview-btn" 
                onClick={() => {
                  setPreviewBook({
                    title: book.title,
                    pages: [
                      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600",
                      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600",
                      "/brain/06f09628-5ede-4195-bac6-2d3a0f5986f8/manuscript_page_1_1778007942085.png",
                      "/brain/06f09628-5ede-4195-bac6-2d3a0f5986f8/manuscript_page_2_1778007965588.png"
                    ]
                  });
                }}
              >
                <span>Preview Archive</span>
                <span className="sp-purchase-price">Visuals</span>
                <span className="sp-purchase-arrow">📖</span>
              </button>
              <a href="mailto:pkhachar@gmail.com" className="sp-purchase-link">
                <span>Contact Author</span>
                <span className="sp-purchase-price">pkhachar@gmail.com</span>
                <span className="sp-purchase-arrow">↗</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="sp-detail-endorsements">
         <motion.div 
           className="sp-endorsement"
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           viewport={{ once: true }}
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
      </div>

      {/* Background Parallax Scroll Effect */}
      <div className="sp-section-scroll-hint">
        <ChevronDown size={20} className="animate-bounce" />
        Scroll to explore next volume
      </div>
    </section>
  );
}

// ── Endless Scroll Overlay ──────────────────────────────────────────────────
function EndlessBookDetail({ 
  books, 
  initialIdx, 
  onClose 
}: { 
  books: Book[]; 
  initialIdx: number; 
  onClose: () => void 
}) {
  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const [previewBook, setPreviewBook] = useState<{ title: string, pages: string[] } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  // Jump to initial book
  useEffect(() => {
    const el = document.getElementById(`book-${initialIdx}`);
    if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
  }, [initialIdx]);

  const handleJump = (i: number) => {
    if (i === -1) onClose();
    else {
      const el = document.getElementById(`book-${i}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.div
      className="sp-detail-overlay endless"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="sp-scroll-progress" style={{ scaleX }} />
      <button className="sp-detail-close" onClick={onClose}>✕</button>

      <ProgressRail books={books} activeIdx={activeIdx} onJump={handleJump} />

      <div className="sp-detail-body endless" ref={containerRef}>
        {books.map((book, i) => (
          <DetailSection 
            key={book.title} 
            book={book} 
            index={i} 
            onVisible={setActiveIdx} 
            setPreviewBook={setPreviewBook}
          />
        ))}
        <div className="sp-endless-footer">
          <p>You have reached the end of the bibliography.</p>
          <button onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}>
             Return to First Volume
          </button>
        </div>
      </div>

      <FlipBookPortal 
        isOpen={!!previewBook}
        onClose={() => setPreviewBook(null)}
        title={previewBook?.title || ""}
        pages={previewBook?.pages || []}
      />
    </motion.div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function BooksPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"stripe" | "card" | "grid" | "table">("stripe");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return BOOKS.filter((b) => {
      const matchCategory = filter === "all" || b.category === filter;
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        (b.titleGu && b.titleGu.includes(search));
      return matchCategory && matchSearch;
    });
  }, [filter, search]);

  const categories = ["all", ...new Set(BOOKS.map((b) => b.category))];

  return (
    <main className="sp-page">
      {/* Editorial Header */}
      <section className="sp-hero-editorial">
        <motion.div 
          className="sp-hero-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="sp-hero-label">COMPLETE BIBLIOGRAPHY</p>
          <h1 className="sp-hero-title">33 Books on History, Heritage & Culture</h1>
          <div className="sp-hero-divider" />
          <p className="sp-hero-subtitle">
            Over three decades of meticulous research into Saurashtra and Gujarat's 
            history — 23 works selected by the Library of Congress, USA.
          </p>
        </motion.div>
      </section>

      {/* Header (Nav style) */}
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
        <div className="sp-controls-top">
          <div className="sp-search-wrap">
            <input
              type="search"
              className="sp-search"
              placeholder="Search bibliography by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="sp-search-count">{filtered.length} books</span>
          </div>
          
          <div className="sp-view-toggles">
            {(["stripe", "card", "grid", "table"] as const).map(mode => (
               <button 
                 key={mode}
                 className={`sp-view-toggle ${viewMode === mode ? 'active' : ''}`}
                 onClick={() => setViewMode(mode)}
                 title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} View`}
               >
                 {mode === "stripe" && <Columns size={16} />}
                 {mode === "card" && <BookOpen size={16} />}
                 {mode === "grid" && <LayoutGrid size={16} />}
                 {mode === "table" && <List size={16} />}
               </button>
            ))}
          </div>
        </div>

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
      </div>

      <div className="sp-view-content">
        {viewMode === "stripe" && (
          <div className="sp-spine-list">
            {filtered.map((book, i) => (
              <BookSpine
                key={book.title}
                book={book}
                index={i}
                onClick={() => setSelectedIdx(i)}
              />
            ))}
          </div>
        )}

        {viewMode === "card" && (
          <div className="sp-card-list">
            {filtered.map((book, i) => (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                viewport={{ once: true }}
              >
                <BookCard 
                  book={book} 
                  index={i} 
                  onClick={() => setSelectedIdx(i)} 
                />
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === "grid" && (
          <div className="sp-grid-list">
            {filtered.map((book, i) => (
              <motion.div 
                key={book.title}
                className="sp-grid-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                viewport={{ once: true }}
                onClick={() => setSelectedIdx(i)}
              >
                <div className="sp-grid-cover">
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt={book.title} />
                  ) : (
                    <div className="sp-grid-placeholder" style={{ background: book.themeColor || CATEGORY_COLORS[book.category] }}>
                      <span>{book.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="sp-grid-info">
                  <div className="sp-grid-title">{book.title}</div>
                  <div className="sp-grid-cat">{BOOK_CATEGORIES[book.category]}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === "table" && (
          <div className="sp-table-wrapper">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Year</th>
                  <th>Publisher</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book, i) => (
                  <tr key={book.title} onClick={() => setSelectedIdx(i)}>
                    <td>
                      <div className="sp-table-title">{book.title}</div>
                      {book.titleGu && <div className="sp-table-titlegu">{book.titleGu}</div>}
                    </td>
                    <td>{BOOK_CATEGORIES[book.category]}</td>
                    <td>{book.year}</td>
                    <td>{book.publisher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="sp-empty">
            <p>No books matching "{search}"</p>
          </div>
        )}
      </div>

      <div className="sp-page-footer">
        <div className="sp-footer-stat"><span className="sp-footer-num">33</span><span>Books Published</span></div>
        <div className="sp-footer-stat"><span className="sp-footer-num">23</span><span>Library of Congress</span></div>
        <div className="sp-footer-stat"><span className="sp-footer-num">11</span><span>High Court Citations</span></div>
        <div className="sp-footer-stat"><span className="sp-footer-num">1997</span><span>First Publication</span></div>
      </div>

      <AnimatePresence>
        {selectedIdx !== null && (
          <EndlessBookDetail
            books={filtered}
            initialIdx={selectedIdx}
            onClose={() => setSelectedIdx(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
