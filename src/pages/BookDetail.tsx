import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { BOOKS, BOOK_CATEGORIES } from "../data/content";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Share2,
  Printer,
  BookOpen,
  Download,
  Check,
  ExternalLink,
} from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const book =
    BOOKS.find((b) => b.slug === slug) ||
    BOOKS.find((b) => b.title.toLowerCase().replace(/ /g, "-") === slug);

  usePageTitle(book ? book.title : "Book Not Found");

  const { addRecent } = useRecentlyViewed();

  useEffect(() => {
    if (book?.slug) {
      addRecent({
        title: book.title,
        slug: book.slug,
        category: book.category,
      });
    }
  }, [book?.slug]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!book) return;

    const title = `${book.title} — Dr. Praduman Khachar`;
    const description =
      book.description ||
      `${book.title} by Dr. Praduman Khachar. ${book.publisher ? `Published by ${book.publisher}.` : ""} ${book.locSelected ? "Selected by Library of Congress, USA." : ""}`;
    const url = `${window.location.origin}/books/${book.slug || book.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const image = book.imageUrl || `${window.location.origin}/og-books.png`;

    // Set or create meta tags
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(
        `meta[property="${property}"]`,
      ) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setName = (name: string, content: string) => {
      let el = document.querySelector(
        `meta[name="${name}"]`,
      ) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", url);
    setMeta("og:image", image);
    setMeta("og:type", "book");
    setMeta("og:site_name", "Dr. Praduman Khachar — Historian & Author");
    setName("twitter:card", "summary_large_image");
    setName("twitter:title", title);
    setName("twitter:description", description);
    setName("twitter:image", image);

    // Cleanup: reset to default on unmount
    return () => {
      setMeta(
        "og:title",
        "Dr. Praduman Khachar — Historian, Author, Professor",
      );
      setMeta(
        "og:description",
        "Portfolio of Dr. Pradumankumar B. Khachar — renowned historian, author of 33 books.",
      );
      setMeta("og:type", "website");
      setName("twitter:card", "summary");
    };
  }, [book]);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    const shareData = { title: book?.title || "", url };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        navigator.clipboard.writeText(url).then(() => setCopied(true));
      });
    } else {
      navigator.clipboard.writeText(url).then(() => setCopied(true));
    }
  }, [book]);

  const relatedBooks = book
    ? BOOKS.filter(
        (b) => b.category === book.category && b.slug !== book.slug,
      ).slice(0, 4)
    : [];

  if (!book) {
    return (
      <main
        className="page-content"
        style={{ textAlign: "center", padding: "10rem 2rem" }}
      >
        <h1 className="not-found-title">Volume Missing</h1>
        <p className="not-found-text">
          The requested bibliographic record could not be found in the archive.
        </p>
        <Link to="/books" className="btn-primary">
          Return to Bibliography
        </Link>
      </main>
    );
  }

  const accent = book.themeColor || "#c5a55a";

  return (
    <main
      className="book-detail-page"
      style={{ "--book-accent": accent } as React.CSSProperties}
    >
      <div className="book-detail-bg">
        <div className="book-detail-bg-pattern" />
      </div>

      <div className="book-detail-container">
        <nav className="book-detail-nav">
          <button onClick={() => navigate(-1)} className="back-link">
            <ChevronLeft size={18} /> Back to Collection
          </button>
          <div className="nav-actions">
            <button className="action-btn" onClick={handleShare} title="Share">
              {copied ? <Check size={16} /> : <Share2 size={16} />}
            </button>
            {copied && <span className="copied-toast">Copied!</span>}
            <button
              className="action-btn"
              onClick={() => window.print()}
              title="Print"
            >
              <Printer size={16} />
            </button>
          </div>
        </nav>

        {/* Breadcrumbs */}
        <nav className="book-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">
            Home
          </Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/books" className="breadcrumb-link">
            Books
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{book.title}</span>
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
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="book-detail-img"
                />
              ) : (
                <div className="book-detail-placeholder">
                  <div className="placeholder-texture" />
                  <div className="placeholder-content">
                    <span className="placeholder-label">
                      {BOOK_CATEGORIES[book.category]}
                    </span>
                    <h2 className="placeholder-title">
                      {book.titleGu || book.title}
                    </h2>
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
            <div className="book-category-tag">
              {BOOK_CATEGORIES[book.category]}
            </div>
            <h1 className="book-main-title">{book.title}</h1>
            {book.titleGu && (
              <h2 className="book-gujarati-title">{book.titleGu}</h2>
            )}

            <div className="book-author-meta">
              <span>By Dr. Praduman Khachar</span>
              <span className="sep">•</span>
              <span>Published {book.year || "n.d."}</span>
            </div>

            <p className="book-description">
              {book.description ||
                "A cornerstone of Saurashtra's historical documentation. This volume provides in-depth analysis and archival evidence regarding the region's complex socio-political evolution, meticulously researched over decades."}
            </p>

            {/* Table of Contents */}
            {book.toc && book.toc.length > 0 && (
              <div className="book-toc">
                <h3 className="book-toc-title">Table of Contents</h3>
                <ol className="book-toc-list">
                  {book.toc.map((chapter, i) => (
                    <li key={i} className="book-toc-item">
                      {chapter}
                    </li>
                  ))}
                </ol>
              </div>
            )}

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
                <span className="meta-val">
                  {book.locSelected ? "🏛️ Preserved in LOC" : "✅ Digitized"}
                </span>
              </div>
            </div>

            {/* Endorsements */}
            {book.endorsements && book.endorsements.length > 0 && (
              <div className="book-endorsements">
                <h3 className="endorsements-title">Endorsements</h3>
                {book.endorsements.map((endorsement, i) => (
                  <blockquote key={i} className="endorsement-block">
                    <p className="endorsement-text">
                      &ldquo;{endorsement.text}&rdquo;
                    </p>
                    <footer className="endorsement-footer">
                      <span className="endorsement-author">
                        {endorsement.author}
                      </span>
                      {endorsement.role && (
                        <span className="endorsement-role">
                          {endorsement.role}
                        </span>
                      )}
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}

            <div className="book-actions">
              <a
                href={`mailto:pkhachar@gmail.com?subject=Inquiry regarding: ${book.title}`}
                className="buy-btn"
              >
                <BookOpen size={18} /> Request Access
              </a>
              <button className="secondary-btn" onClick={() => window.print()}>
                <Download size={18} /> Export Metadata
              </button>
            </div>

            {/* Purchase Links */}
            {book.purchaseLinks && book.purchaseLinks.length > 0 && (
              <div className="book-purchase-links">
                {book.purchaseLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="purchase-link-btn"
                  >
                    <ExternalLink size={14} />
                    <span className="purchase-store">{link.store}</span>
                    <span className="purchase-price">{link.price}</span>
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <section className="book-context-section">
          <div className="section-divider" />
          <h3 className="context-title">Scholarly Impact</h3>
          <p className="context-text">
            This work has been widely cited across Gujarati academic circles and
            remains a definitive reference for researchers specializing in{" "}
            {BOOK_CATEGORIES[book.category].toLowerCase()}.
            {book.locSelected &&
              " Its inclusion in the Library of Congress (USA) underscores its international scholarly value."}
          </p>
        </section>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="related-books-section">
            <div className="section-divider" />
            <h3 className="related-books-title">Related Works</h3>
            <div className="related-books-grid">
              {relatedBooks.map((rb) => (
                <Link
                  key={rb.slug}
                  to={`/books/${rb.slug}`}
                  className="related-book-card"
                >
                  <div className="related-book-info">
                    <h4 className="related-book-name">{rb.title}</h4>
                    <div className="related-book-meta">
                      {rb.year && (
                        <span className="related-book-year">{rb.year}</span>
                      )}
                      <span className="related-book-category">
                        {BOOK_CATEGORIES[rb.category]}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
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
        .nav-actions { display: flex; gap: 1rem; align-items: center; }
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

        .book-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-family: var(--font-sans);
          font-size: 0.8rem;
        }
        .breadcrumb-link {
          color: var(--c-ink-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .breadcrumb-link:hover {
          color: var(--book-accent);
        }
        .breadcrumb-sep {
          color: var(--c-ink-muted);
          opacity: 0.4;
        }
        .breadcrumb-current {
          color: var(--c-ink);
          font-weight: 600;
        }
        .copied-toast {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--book-accent);
          animation: fadeInToast 0.2s ease;
        }
        @keyframes fadeInToast {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

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

        /* Table of Contents */
        .book-toc {
          margin-bottom: 3.5rem;
          padding: 2rem;
          background: var(--c-parchment-deep, rgba(0,0,0,0.02));
          border: 1px solid var(--c-border-light, var(--c-border, #e5e5e5));
          border-radius: 8px;
        }
        [data-theme="dark"] .book-toc {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.08);
        }
        .book-toc-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--book-accent);
          margin-bottom: 1.25rem;
        }
        .book-toc-list {
          list-style: none;
          counter-reset: toc-counter;
          padding: 0;
          margin: 0;
        }
        .book-toc-item {
          counter-increment: toc-counter;
          padding: 0.6rem 0;
          border-bottom: 1px solid var(--c-border-light, rgba(0,0,0,0.06));
          font-size: 1rem;
          line-height: 1.5;
          color: var(--c-ink-soft, #555);
          display: flex;
          gap: 0.75rem;
        }
        .book-toc-item:last-child { border-bottom: none; }
        .book-toc-item::before {
          content: counter(toc-counter, decimal-leading-zero);
          font-weight: 700;
          color: var(--book-accent);
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }

        .book-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem 2.5rem;
          margin-bottom: 4rem;
          border-top: 1px solid var(--c-border-light);
          padding-top: 2rem;
        }
        .meta-item { display: flex; flex-direction: column; gap: 4px; }
        .meta-label { font-size: 0.75rem; text-transform: uppercase; color: var(--c-ink-muted); font-weight: 700; letter-spacing: 0.05em; }
        .meta-val { font-size: 1.1rem; font-weight: 600; }

        /* Endorsements */
        .book-endorsements {
          margin-bottom: 3rem;
        }
        .endorsements-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--book-accent);
          margin-bottom: 1.5rem;
        }
        .endorsement-block {
          border-left: 3px solid var(--book-accent);
          padding: 1.25rem 1.5rem;
          margin: 0 0 1.5rem 0;
          background: var(--c-parchment-deep, rgba(0,0,0,0.02));
          border-radius: 0 8px 8px 0;
        }
        [data-theme="dark"] .endorsement-block {
          background: rgba(255,255,255,0.03);
        }
        .endorsement-text {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--c-ink-soft, #555);
          font-style: italic;
          margin: 0 0 0.75rem 0;
        }
        .endorsement-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .endorsement-author {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--c-ink, #111);
        }
        .endorsement-role {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: var(--c-ink-muted, #888);
        }

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

        /* Purchase Links */
        .book-purchase-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .purchase-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border: 1px solid var(--c-border, #ddd);
          border-radius: 6px;
          background: var(--c-parchment-deep, rgba(0,0,0,0.02));
          color: var(--c-ink, #111);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: 0.2s;
        }
        [data-theme="dark"] .purchase-link-btn {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
          color: #fff;
        }
        .purchase-link-btn:hover {
          border-color: var(--book-accent);
          color: var(--book-accent);
          transform: translateY(-1px);
        }
        .purchase-store { font-weight: 700; }
        .purchase-price {
          font-size: 0.8rem;
          opacity: 0.6;
          font-weight: 400;
        }

        .book-context-section { margin-top: 8rem; max-width: 800px; }
        .section-divider { width: 60px; height: 3px; background: var(--book-accent); margin-bottom: 2rem; }
        .context-title { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem; }
        .context-text { font-size: 1.1rem; line-height: 1.6; color: var(--c-ink-soft); }

        /* Related Books */
        .related-books-section {
          margin-top: 5rem;
          max-width: 1000px;
        }
        .related-books-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }
        .related-books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }
        .related-book-card {
          display: block;
          padding: 1.25rem;
          border: 1px solid var(--c-border-light, var(--c-border, #e5e5e5));
          border-radius: 8px;
          background: rgba(255,255,255,0.4);
          text-decoration: none;
          color: inherit;
          transition: 0.25s;
        }
        [data-theme="dark"] .related-book-card {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.08);
        }
        .related-book-card:hover {
          border-color: var(--book-accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        [data-theme="dark"] .related-book-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .related-book-name {
          font-family: var(--font-display);
          font-size: 1rem;
          line-height: 1.3;
          margin-bottom: 0.75rem;
        }
        .related-book-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .related-book-year {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--c-ink-muted, #888);
        }
        .related-book-category {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 2px 8px;
          border-radius: 3px;
          background: var(--book-accent);
          color: #fff;
        }
      `}</style>
    </main>
  );
}
