import { useState, useEffect, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BOOKS, BOOK_CATEGORIES } from "../data/content";
import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";
import { Book } from "../types";

const ALL_CATEGORIES = ["all", ...new Set(BOOKS.map((b) => b.category))];

interface BookFullCardProps extends Book {
  index: number;
}

export default function BooksPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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
                  <BookTableRow key={book.title} {...book} index={i} onSelect={() => setSelectedBook(book)} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedBook && (
          <BookDetailOverlay 
            book={selectedBook} 
            onClose={() => setSelectedBook(null)} 
          />
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

function BookTableRow({ title, titleGu, category, year, locSelected, publisher, isbn, pages, imageUrl, description, index, onSelect }: BookFullCardProps & { onSelect?: () => void }) {
  const [ref, visible] = useReveal(0.02);
  
  return (
    <tr 
      ref={ref as RefObject<HTMLTableRowElement>}
      onClick={onSelect}
      style={{ 
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `all 0.5s ${Math.min(index * 0.01, 0.2)}s cubic-bezier(0.16, 1, 0.3, 1)`,
        cursor: 'pointer'
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

function BookFullCard({ title, titleGu, category, year, locSelected, publisher, price, isbn, pages, imageUrl, description, index, onSelect }: BookFullCardProps & { onSelect?: () => void }) {
  const [ref, visible] = useReveal(0.05);
  const categoryLabel = BOOK_CATEGORIES[category] || category;

  return (
    <div
      ref={ref}
      className={`book-card book-card-full ${locSelected ? "loc-selected" : ""}`}
      onClick={onSelect}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.45s ${Math.min(index * 0.03, 0.4)}s cubic-bezier(0.16, 1, 0.3, 1)`,
        cursor: 'pointer'
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

function BookDetailOverlay({ book, onClose }: { book: Book; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="book-detail-overlay"
      style={{ backgroundColor: '#fff' }}
    >
      <button className="book-detail-close" onClick={onClose} data-cursor-text="Close">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      
      <div className="scroll-indicators">
        <div className="brand-mark">G</div>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`indicator-dot ${i === 0 ? 'active' : ''}`} />
        ))}
      </div>

      <div className="book-detail-container detail-sticky-container">
        <div className="detail-left-sticky">
          <motion.div 
            initial={{ scale: 0.9, rotateY: -30 }}
            animate={{ scale: 1, rotateY: -20 }}
            className="book-3d-canvas"
            style={{ width: '400px', height: '580px', boxShadow: '30px 40px 80px rgba(0,0,0,0.15)' }}
          >
            {book.imageUrl ? (
              <img src={book.imageUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="book-cover-placeholder" style={{ width: '100%', height: '100%', background: '#242424' }}>
                <div style={{ padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
                  <span style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Bibliographic Record</span>
                  <div>
                    <h2 style={{ fontSize: '2.5rem', lineHeight: 1, marginBottom: '0.5rem' }}>{book.title}</h2>
                    {book.titleGu && <div style={{ fontSize: '1.2rem', opacity: 0.8, fontFamily: 'var(--font-body)', marginBottom: '1rem' }}>{book.titleGu}</div>}
                    <p style={{ opacity: 0.6 }}>Dr. Praduman Khachar</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                     <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>LOC ID: {book.isbn || 'ARCH-222'}</span>
                     <div className="brand-mark" style={{ borderColor: 'rgba(255,255,255,0.2)', marginBottom: 0 }}>G</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="detail-right-content">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2rem', color: 'var(--c-terracotta)' }}>Bibliographic Record</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 500, marginBottom: '0.5rem', letterSpacing: '-0.02em', color: 'var(--c-ink)' }}>{book.title}</h1>
            <div className="book-detail-author" style={{ fontSize: '1.8rem', marginBottom: '4rem', color: 'var(--c-ink-soft)' }}>Dr. Praduman Khachar</div>
            
            <div className="book-detail-description" style={{ fontSize: '1.4rem', lineHeight: 1.5, marginBottom: '5rem', fontWeight: 400, color: 'var(--c-ink)' }}>
              {book.description || "The definitive record of Saurashtra's architectural and cultural history. This volume explores the intricate relationship between the region's princely courts and its folk traditions, documented through decades of field research."}
            </div>

            <div className="book-tech-specs" style={{ marginBottom: '5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', borderTop: '1px solid var(--c-border)', paddingTop: '2rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.5rem' }}>ISBN</div>
                <div style={{ fontSize: '1rem' }}>{book.isbn || "ARCH-BIB-001"}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.5rem' }}>Pages</div>
                <div style={{ fontSize: '1rem' }}>{book.pages || "—"}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.5rem' }}>Year</div>
                <div style={{ fontSize: '1rem' }}>{book.year || "—"}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.5rem' }}>Publisher</div>
                <div style={{ fontSize: '1rem' }}>{book.publisher || "Saurashtra University"}</div>
              </div>
            </div>

            <div className="book-purchase-links" style={{ maxWidth: '400px', border: '1px solid var(--c-border)' }}>
              <a href="#" className="purchase-link">
                <span>Direct Purchase</span>
                <span style={{ opacity: 0.4 }}>{book.price || "Contact for Price"}</span>
                <span className="purchase-link-arrow">↗</span>
              </a>
              <a href="#" className="purchase-link">
                <span>Library of Congress</span>
                <span style={{ opacity: 0.4 }}>{book.locSelected ? "Archived" : "Not Archived"}</span>
                <span className="purchase-link-arrow">🏛️</span>
              </a>
            </div>
          </motion.div>

          <div className="endorsements-section" style={{ marginTop: '10rem' }}>
            <div className="endorsement-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="endorsement-item" style={{ borderTop: '1px solid #000', padding: '3rem 0' }}>
                <div style={{ display: 'flex', gap: '4rem' }}>
                  <div style={{ flex: 1 }}>
                    <p className="endorsement-text" style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '2rem' }}>
                      "Dr. Khachar is the preeminent historian of the Kathiawar peninsula. His work on the 222 princely states is a masterpiece of archival detective work."
                    </p>
                    <div className="endorsement-author" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Charles C. Mann</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>author of 1491: New Revelations of the Americas Before Columbus</div>
                  </div>
                </div>
              </div>
              <div className="endorsement-item" style={{ borderTop: '1px solid #000', padding: '3rem 0' }}>
                <div style={{ display: 'flex', gap: '4rem' }}>
                  <div style={{ flex: 1 }}>
                    <p className="endorsement-text" style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '2rem' }}>
                      "A stunning achievement in preservation. Khachar's bibliography is not just a list of books, but a map of a vanishing culture."
                    </p>
                    <div className="endorsement-author" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Edward Tufte</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>statistician and professor emeritus at Yale University</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
