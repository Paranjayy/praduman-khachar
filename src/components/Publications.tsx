import { useState } from "react";
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

  const filtered = filter === "all"
    ? BOOKS
    : BOOKS.filter((b) => b.category === filter);

  const displayBooks = expanded ? filtered : filtered.slice(0, 12);

  return (
    <section id="publications" className="section">
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
        <p className="section-label">Publications</p>
        <h2 className="section-title">33 Books.<br />A Scholar's Legacy.</h2>
        <div className="section-divider" />
      </div>

      <div className="books-intro">
        <div>
          <p style={{
            fontSize: "clamp(1rem, 1.15vw, 1.1rem)",
            color: "var(--c-ink-soft)",
            maxWidth: "36rem",
            lineHeight: 1.7,
          }}>
            A prolific author whose work spans the breadth of Saurashtra's
            history — from ancient kingdoms and Nawabi courts to folk traditions
            and architectural heritage. Each book represents years of primary
            research, field documentation, and archival scholarship.
          </p>
        </div>
        <div className="books-count">33</div>
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
            {f.key !== "all" && (
              <span className="filter-count">
                {BOOKS.filter((b) => b.category === f.key).length}
              </span>
            )}
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
