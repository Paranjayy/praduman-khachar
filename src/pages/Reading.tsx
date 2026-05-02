import { useState } from "react";
import { READING_LIST, READING_CATEGORIES } from "../data/content";
import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";

export default function ReadingPage() {
  const [filter, setFilter] = useState("all");
  const categories = ["all", ...Object.keys(READING_CATEGORIES)];

  const filtered = READING_LIST.filter(
    (item) => filter === "all" || item.category === filter
  );

  return (
    <main className="page-content">
      <PageHeader
        label="Scholar's Library"
        title="The Reading Room"
        subtitle="A curated selection of foundational historical texts and literature recommended by Dr. Khachar for researchers and students of Saurashtra history."
      />

      <section className="section">
        {/* Filters */}
        <div className="book-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`book-filter-btn${filter === cat ? " active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? "All Recommendations" : READING_CATEGORIES[cat]}
            </button>
          ))}
        </div>

        {/* Reading List Grid */}
        <div className="reading-grid">
          {filtered.map((item, i) => (
            <ReadingCard key={item.title} {...item} index={i} />
          ))}
        </div>

        <style>{`
          .reading-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: var(--space-lg);
          }
          .reading-card {
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border-light);
            padding: var(--space-lg);
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
            position: relative;
            transition: all 0.4s ease;
          }
          .reading-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px oklch(0.1 0.05 60 / 0.08);
            border-color: var(--c-terracotta);
          }
          .reading-author {
            font-size: 0.72rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--c-amber);
            font-weight: 600;
          }
          .reading-title {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--c-ink);
            line-height: 1.3;
          }
          .reading-note {
            font-size: 0.9rem;
            color: var(--c-ink-soft);
            line-height: 1.6;
            font-style: italic;
            border-left: 2px solid var(--c-border);
            padding-left: var(--space-sm);
            margin: var(--space-sm) 0;
          }
          .reading-link {
            margin-top: auto;
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--c-terracotta);
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }
          .reading-link:hover {
            text-decoration: underline;
          }
        `}</style>
      </section>
    </main>
  );
}

function ReadingCard({ title, author, note, link, index }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="reading-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ${index * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="reading-author">{author}</div>
      <h3 className="reading-title">{title}</h3>
      {note && <p className="reading-note">"{note}"</p>}
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="reading-link">
          Read on Archive.org →
        </a>
      )}
    </div>
  );
}
