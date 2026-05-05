import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BOOKS, BOOK_CATEGORIES } from "../data/content";
import { useReveal } from "../hooks/useAnimations";

const FILTERS = [
  { key: "all", label: "All Books" },
  { key: "kathi", label: "Kathi History" },
  { key: "history", label: "Regional History" },
  { key: "royals", label: "Royal Heritage" },
  { key: "heritage", label: "Culture & Heritage" },
];

export default function Publications() {
  const [ref, visible] = useReveal();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const filtered = filter === "all"
    ? BOOKS
    : BOOKS.filter((b) => b.category === filter);

  const displayBooks = expanded ? filtered : filtered.slice(0, 12);

  return (
    <section id="publications" className="section" ref={containerRef}>
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
        <div className="brand-mark">G</div>
        <p className="section-label">Selected Works</p>
        <h2 className="section-title">The Bibliographic Archive.</h2>
        <div className="section-divider" />
      </div>

      <div className="books-intro" style={{ marginBottom: '8rem' }}>
        <div className="books-stack-visual">
          {[0, 1, 2, 3].map((i) => {
            const book = BOOKS[i];
            return (
              <motion.div
                key={i}
                className="book-spine-3d"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [i * 40, i * -40]),
                  rotateX: useTransform(scrollYProgress, [0, 1], [20, -20]),
                  zIndex: 10 - i,
                  background: i % 2 === 0 ? '#2a2a2a' : '#3a3a3a',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 2rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  borderLeft: '4px solid var(--c-accent)'
                }}
              >
                {book.title}
              </motion.div>
            );
          })}
        </div>
        
        <div style={{ flex: 1, paddingTop: '2rem' }}>
          <p className="reveal-up visible" style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'var(--c-ink-soft)' }}>
            Dr. Praduman Khachar's publication record spans 33 seminal works, 
            forming the bedrock of modern Saurashtra historiography. 
            From the Library of Congress to the benches of the High Court, 
            these volumes serve as the definitive records of a vanishing heritage.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="book-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`book-filter-btn${filter === f.key ? " active" : ""}`}
            onClick={() => { setFilter(f.key); setExpanded(false); }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Books grid */}
      <div className="books-grid">
        {displayBooks.map((book, i) => (
          <BookCard key={book.title} {...book} index={i} />
        ))}
      </div>


      {filtered.length > 12 && !expanded && (
        <div style={{ textAlign: "center", marginTop: "var(--space-lg)" }}>
          <button
            className="show-more-btn"
            onClick={() => setExpanded(true)}
          >
            Show All {filtered.length} Books
          </button>
        </div>
      )}

      {/* Highlights grid */}
      <div style={{ marginTop: "var(--space-2xl)" }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.72rem",
          fontWeight: 600,
          color: "var(--c-ink-muted)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: "var(--space-lg)",
        }}>Scholarly Impact</h3>
        <div className="books-grid">
          {[
            {
              num: "Recognition",
              title: "Library of Congress, USA",
              desc: "23 of his 33 books have been selected and preserved by the Library of Congress — one of the highest honors for any regional historian worldwide.",
            },
            {
              num: "Research",
              title: "15 Research Articles",
              desc: "Published in various national and international research journals, covering unexplored dimensions of Saurashtra's medieval and modern history.",
            },
            {
              num: "Legal Impact",
              title: "Cited in 11 Court Cases",
              desc: "His books have served as evidence in Gujarat courts — a testament to the rigor and authority of his historical documentation.",
            },
          ].map((item, i) => (
            <HighlightCard key={i} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface BookCardProps {
  title: string;
  titleGu?: string;
  category: string;
  year?: string;
  publisher?: string;
  price?: string;
  index: number;
}

function BookCard({ title, titleGu, category, year, publisher, price, index }: BookCardProps) {
  const [ref, visible] = useReveal(0.05);
  const categoryLabel = BOOK_CATEGORIES[category] || category;

  return (
    <div
      ref={ref}
      className="book-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.5s ${Math.min(index * 0.04, 0.5)}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="book-number">{categoryLabel}{year ? ` · ${year}` : ""}</div>
      <div className="book-title">{title}</div>
      {titleGu && <div className="book-gujarati">{titleGu}</div>}
      <div className="book-details" style={{ marginTop: '0.75rem', borderTop: '1px solid var(--c-border-light)', paddingTop: '0.75rem' }}>
        {publisher && (
          <div className="book-detail">
            <span className="book-detail-label">Publisher</span>
            <span className="book-detail-val">{publisher}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface HighlightCardProps {
  num: string;
  title: string;
  desc: string;
  index: number;
}

function HighlightCard({ num, title, desc, index }: HighlightCardProps) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="book-card highlight-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ${index * 0.08}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="book-number">{num}</div>
      <div className="book-title">{title}</div>
      <div className="book-desc">{desc}</div>
    </div>
  );
}
