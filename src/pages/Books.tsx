import { useState } from "react";
import { BOOKS, BOOK_CATEGORIES } from "../data/content";
import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";

const ALL_CATEGORIES = ["all", ...new Set(BOOKS.map((b) => b.category))];

export default function BooksPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = BOOKS.filter((b) => {
    const matchCategory = filter === "all" || b.category === filter;
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.titleGu && b.titleGu.includes(search));
    return matchCategory && matchSearch;
  });

  return (
    <main className="page-content">
      <PageHeader
        label="Complete Bibliography"
        title={`33 Books on History, Heritage & Culture`}
        subtitle="Over three decades of meticulous research into Saurashtra and Gujarat's history — 23 works selected by the Library of Congress, USA."
      />
      <section className="section">

        {/* Search */}
        <div className="books-search-row">
          <input
            type="search"
            className="books-search"
            placeholder="Search books by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="books-result-count">
            {filtered.length} {filtered.length === 1 ? "book" : "books"}
          </span>
        </div>

        {/* Filters */}
        <div className="book-filters">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`book-filter-btn${filter === cat ? " active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? "All" : BOOK_CATEGORIES[cat] || cat}
              {cat !== "all" && (
                <span className="filter-count">
                  {BOOKS.filter((b) => b.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Books grid */}
        <div className="books-grid books-grid-full">
          {filtered.map((book, i) => (
            <BookFullCard key={book.title} {...book} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No books found matching "{search}"</p>
          </div>
        )}

        {/* Stats footer */}
        <div className="books-page-stats">
          <div className="bps-item">
            <span className="bps-number">33</span>
            <span className="bps-label">Books Published</span>
          </div>
          <div className="bps-item">
            <span className="bps-number">23</span>
            <span className="bps-label">In Library of Congress</span>
          </div>
          <div className="bps-item">
            <span className="bps-number">15</span>
            <span className="bps-label">Research Articles</span>
          </div>
          <div className="bps-item">
            <span className="bps-number">11</span>
            <span className="bps-label">Cited in Court Cases</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function BookFullCard({ title, titleGu, category, year, index }) {
  const [ref, visible] = useReveal(0.05);
  const categoryLabel = BOOK_CATEGORIES[category] || category;

  return (
    <div
      ref={ref}
      className="book-card book-card-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.45s ${Math.min(index * 0.03, 0.4)}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="book-card-index">{String(index + 1).padStart(2, "0")}</div>
      <div className="book-card-body">
        <div className="book-number">{categoryLabel}{year ? ` · ${year}` : ""}</div>
        <div className="book-title">{title}</div>
        {titleGu && <div className="book-gujarati">{titleGu}</div>}
      </div>
    </div>
  );
}
