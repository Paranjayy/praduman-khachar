import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BOOKS, BOOK_CATEGORIES } from "../data/content";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Share2, Printer, BookOpen, Download } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const book = BOOKS.find(b => b.slug === slug) || BOOKS.find(b => b.title.toLowerCase().replace(/ /g, '-') === slug);

  usePageTitle(book ? book.title : "Book Not Found");

  if (!book) {
    return (
      <main className="page-content" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h1 className="not-found-title">Volume Missing</h1>
        <p className="not-found-text">The requested bibliographic record could not be found in the archive.</p>
        <Link to="/books" className="btn-primary">Return to Bibliography</Link>
      </main>
    );
  }

  const accent = book.themeColor || "#c5a55a";

  return (
    <main className="book-detail-page" style={{ "--book-accent": accent } as React.CSSProperties}>
      <div className="book-detail-bg">
        <div className="book-detail-bg-pattern" />
      </div>

      <div className="book-detail-container">
        <nav className="book-detail-nav">
          <button onClick={() => navigate(-1)} className="back-link">
            <ChevronLeft size={18} /> Back to Collection
          </button>
          <div className="nav-actions">
             <button className="action-btn"><Share2 size={16} /></button>
             <button className="action-btn"><Printer size={16} /></button>
          </div>
        </nav>

        <div className="book-detail-grid">
          <motion.div 
            className="book-detail-visual"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="book-detail-cover-wrap">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} className="book-detail-img" />
              ) : (
                <div className="book-detail-placeholder">
                  <div className="placeholder-texture" />
                  <div className="placeholder-content">
                    <span className="placeholder-label">{BOOK_CATEGORIES[book.category]}</span>
                    <h2 className="placeholder-title">{book.titleGu || book.title}</h2>
                    <p className="placeholder-author">Dr. Praduman Khachar</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="book-detail-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="book-category-tag">{BOOK_CATEGORIES[book.category]}</div>
            <h1 className="book-main-title">{book.title}</h1>
            {book.titleGu && <h2 className="book-gujarati-title">{book.titleGu}</h2>}
            
            <div className="book-author-meta">
              <span>By Dr. Praduman Khachar</span>
              <span className="sep">•</span>
              <span>Published {book.year || "n.d."}</span>
            </div>

            <p className="book-description">
              {book.description || "A cornerstone of Saurashtra's historical documentation. This volume provides in-depth analysis and archival evidence regarding the region's complex socio-political evolution, meticulously researched over decades."}
            </p>

            <div className="book-meta-grid">
              {book.isbn && (
                <div className="meta-item">
                  <span className="meta-label">ISBN</span>
                  <span className="meta-val">{book.isbn}</span>
                </div>
              )}
              {book.pages && (
                <div className="meta-item">
                  <span className="meta-label">Length</span>
                  <span className="meta-val">{book.pages} Pages</span>
                </div>
              )}
              {book.publisher && (
                <div className="meta-item">
                  <span className="meta-label">Publisher</span>
                  <span className="meta-val">{book.publisher}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Archival Status</span>
                <span className="meta-val">{book.locSelected ? "🏛️ Preserved in LOC" : "✅ Digitized"}</span>
              </div>
            </div>

            <div className="book-actions">
              <a href={`mailto:pkhachar@gmail.com?subject=Inquiry regarding: ${book.title}`} className="buy-btn">
                <BookOpen size={18} /> Request Access
              </a>
              <button className="secondary-btn" onClick={() => window.print()}>
                <Download size={18} /> Export Metadata
              </button>
            </div>
          </motion.div>
        </div>

        <section className="book-context-section">
           <div className="section-divider" />
           <h3 className="context-title">Scholarly Impact</h3>
           <p className="context-text">
             This work has been widely cited across Gujarati academic circles and remains a definitive 
             reference for researchers specializing in {BOOK_CATEGORIES[book.category].toLowerCase()}. 
             {book.locSelected && " Its inclusion in the Library of Congress (USA) underscores its international scholarly value."}
           </p>
        </section>
      </div>

      <style>{`
        .book-detail-page {
          min-height: 100vh;
          background: var(--c-parchment);
          position: relative;
          color: var(--c-ink);
        }
        [data-theme="dark"] .book-detail-page {
          background: #0a0a0a;
          color: #fff;
        }
        .book-detail-bg {
          position: absolute;
          inset: 0;
          height: 40vh;
          background: var(--book-accent);
          opacity: 0.1;
          z-index: 0;
        }
        .book-detail-bg-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(var(--book-accent) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.2;
        }
        .book-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }
        .book-detail-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--c-ink-soft);
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .back-link:hover { color: var(--book-accent); }
        .nav-actions { display: flex; gap: 1rem; }
        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--c-border);
          background: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--c-ink-soft);
          cursor: pointer;
          transition: 0.2s;
        }
        .action-btn:hover { background: var(--book-accent); color: #fff; border-color: var(--book-accent); }

        .book-detail-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .book-detail-grid { grid-template-columns: 1fr; gap: 3rem; }
          .book-detail-visual { justify-self: center; }
        }

        .book-detail-cover-wrap {
          width: 100%;
          max-width: 380px;
          aspect-ratio: 2/3;
          box-shadow: 30px 40px 80px rgba(0,0,0,0.25);
          border-radius: 4px;
          overflow: hidden;
          background: #111;
        }
        .book-detail-img { width: 100%; height: 100%; object-fit: cover; }
        
        .book-detail-placeholder {
          width: 100%;
          height: 100%;
          background: var(--book-accent);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
          color: #fff;
        }
        .placeholder-texture {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
        }
        .placeholder-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; }
        .placeholder-title { font-family: var(--font-display); font-size: 1.8rem; margin: 1.5rem 0; }

        .book-category-tag {
          display: inline-block;
          background: var(--book-accent);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 4px 12px;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }
        .book-main-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        .book-gujarati-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: var(--c-ink-soft);
          margin-bottom: 2rem;
        }
        .book-author-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-sans);
          font-weight: 600;
          color: var(--c-ink-soft);
          margin-bottom: 2.5rem;
        }
        .book-author-meta .sep { opacity: 0.3; }

        .book-description {
          font-size: 1.2rem;
          line-height: 1.6;
          color: var(--c-ink-soft);
          max-width: 700px;
          margin-bottom: 3.5rem;
        }

        .book-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
          border-top: 1px solid var(--c-border-light);
          padding-top: 2rem;
        }
        .meta-item { display: flex; flex-direction: column; gap: 4px; }
        .meta-label { font-size: 0.75rem; text-transform: uppercase; color: var(--c-ink-muted); font-weight: 700; letter-spacing: 0.05em; }
        .meta-val { font-size: 1.1rem; font-weight: 600; }

        .book-actions { display: flex; gap: 1.5rem; }
        .buy-btn {
          background: var(--book-accent);
          color: #fff;
          padding: 1rem 2.5rem;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.3s;
        }
        .buy-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .secondary-btn {
          background: var(--c-parchment-deep);
          border: 1px solid var(--c-border);
          color: var(--c-ink);
          padding: 1rem 2.5rem;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.3s;
        }
        [data-theme="dark"] .secondary-btn { background: rgba(255,255,255,0.05); color: #fff; }

        .book-context-section { margin-top: 8rem; max-width: 800px; }
        .section-divider { width: 60px; height: 3px; background: var(--book-accent); margin-bottom: 2rem; }
        .context-title { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem; }
        .context-text { font-size: 1.1rem; line-height: 1.6; color: var(--c-ink-soft); }
      `}</style>
    </main>
  );
}
