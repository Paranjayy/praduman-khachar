import { useState } from "react";
import { BOOKS, BOOK_CATEGORIES } from "../data/content";
import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";

const ALL_CATEGORIES = ["all", ...new Set(BOOKS.map((b) => b.category))];

export default function BooksPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

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

        {/* Search & View Controls */}
        <div className="books-view-controls">
          <div className="books-search-wrapper" style={{ flex: 1, marginRight: '2rem' }}>
            <input
              type="search"
              className="books-search"
              placeholder="Search books by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', marginBottom: 0 }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span className="books-result-count" style={{ opacity: 0.6, fontSize: '0.85rem' }}>
              {filtered.length} {filtered.length === 1 ? "book" : "books"}
            </span>
            
            <div className="view-toggle">
              <button 
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Table
              </button>
            </div>
          </div>
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

        {/* Books Content */}
        {viewMode === "grid" ? (
          <div className="books-grid books-grid-full">
            {filtered.map((book, i) => (
              <BookFullCard key={book.title} {...book} index={i} />
            ))}
          </div>
        ) : (
          <div className="books-table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="books-table">
              <thead>
                <tr>
                  <th className="bt-year">Year</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Publisher</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book, i) => (
                  <BookTableRow key={book.title} {...book} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}

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

function BookTableRow({ title, titleGu, category, year, locSelected, publisher, isbn, pages, imageUrl, description, index }: BookFullCardProps) {
  const [ref, visible] = useReveal(0.02);
  
  return (
    <tr 
      ref={ref as RefObject<HTMLTableRowElement>}
      style={{ 
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `all 0.5s ${Math.min(index * 0.01, 0.2)}s cubic-bezier(0.16, 1, 0.3, 1)`
      }}
    >
      <td className="bt-year">{year || "—"}</td>
      <td className="bt-title-cell">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--c-border)' }} />
          ) : (
            <div style={{ width: '40px', height: '60px', background: 'var(--c-bg-subtle)', borderRadius: '2px' }} />
          )}
          <div>
            <span className="bt-title">{title}</span>
            {titleGu && <span className="bt-gujarati">{titleGu}</span>}
            {description && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7, maxWidth: '300px' }}>{description}</p>}
          </div>
        </div>
      </td>
      <td>
        <span className="bt-category">{BOOK_CATEGORIES[category] || category}</span>
        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>
          {pages && <div>{pages} pages</div>}
          {isbn && <div>ISBN: {isbn}</div>}
        </div>
        {locSelected && <div className="bt-loc" style={{ marginTop: '0.5rem' }}>🏛️ LOC Selected</div>}
      </td>
      <td style={{ fontSize: '0.85rem', opacity: 0.8 }}>{publisher || "—"}</td>
    </tr>
  );
}

import { Book } from "../types";

interface BookFullCardProps extends Book {
  index: number;
}

function BookFullCard({ title, titleGu, category, year, locSelected, publisher, price, isbn, pages, imageUrl, description, index }: BookFullCardProps) {
  const [ref, visible] = useReveal(0.05);
  const categoryLabel = BOOK_CATEGORIES[category] || category;

  return (
    <div
      ref={ref}
      className={`book-card book-card-full ${locSelected ? "loc-selected" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.45s ${Math.min(index * 0.03, 0.4)}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="book-card-visual">
        <div className="book-spine"></div>
        <div className="book-cover-placeholder">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="book-cover-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="book-cover-inner">
               <span className="book-cover-letter">{titleGu ? titleGu[0] : title[0]}</span>
               {year && <span className="book-cover-year">{year}</span>}
            </div>
          )}
        </div>
      </div>
      <div className="book-card-body">
        <div className="book-meta-row">
          <div className="book-number">{categoryLabel}</div>
          {locSelected && (
            <div className="loc-badge" title="Selected by Library of Congress, USA">
              <span className="loc-icon">🏛️</span> LOC
            </div>
          )}
        </div>
        <h3 className="book-title">{title}</h3>
        {titleGu && <div className="book-gujarati">{titleGu}</div>}
        
        {description && <p className="book-description-short">{description}</p>}

        <div className="book-details">
          {publisher && (
            <div className="book-detail">
              <span className="book-detail-label">Publisher</span>
              <span className="book-detail-val">{publisher}</span>
            </div>
          )}
          {pages && (
            <div className="book-detail">
              <span className="book-detail-label">Format</span>
              <span className="book-detail-val">{pages} pages</span>
            </div>
          )}
          {isbn && (
            <div className="book-detail">
              <span className="book-detail-label">ISBN</span>
              <span className="book-detail-val">{isbn}</span>
            </div>
          )}
          {price && (
            <div className="book-detail">
              <span className="book-detail-label">Price</span>
              <span className="book-detail-val">{price}</span>
            </div>
          )}
        </div>

        <div className="book-index-tag">#{String(index + 1).padStart(2, "0")}</div>
      </div>
    </div>
  );
}
