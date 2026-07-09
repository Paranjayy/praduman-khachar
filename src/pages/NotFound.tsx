import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { BOOKS } from "../data/content";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Lost in History");

  const randomBook = useMemo(() => {
    return BOOKS[Math.floor(Math.random() * BOOKS.length)];
  }, []);

  return (
    <main className="page-content not-found-page">
      <div className="not-found-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="not-found-content"
        >
          <div className="not-found-eyebrow">Error 404</div>
          <h1 className="not-found-title">Lost in the sands of time.</h1>
          <p className="not-found-text">
            The record you are looking for has either been moved to the deep
            archives or never existed in this timeline.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="not-found-btn primary">
              Return to Present
            </Link>
            <Link to="/explore" className="not-found-btn secondary">
              Search Archives
            </Link>
          </div>
        </motion.div>

        {randomBook && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "3rem",
              padding: "1.5rem",
              background: "var(--c-parchment-deep)",
              borderRadius: "12px",
              border: "1px solid var(--c-border-light)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--c-ink-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              While you're here
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--c-ink-soft)",
                marginBottom: "1rem",
              }}
            >
              Check out this book from the collection:
            </p>
            <Link
              to={`/books/${randomBook.slug || randomBook.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              style={{
                display: "inline-block",
                padding: "0.6rem 1.5rem",
                background: "var(--c-terracotta)",
                color: "white",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                transition: "all 0.2s",
              }}
            >
              {randomBook.title} →
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          className="not-found-bg-text"
        >
          HISTORY
        </motion.div>
      </div>

      <style>{`
        .not-found-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .not-found-container {
          max-width: 600px;
          padding: 0 var(--space-xl);
          z-index: 2;
        }
        .not-found-eyebrow {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--c-terracotta);
          margin-bottom: 1.5rem;
        }
        .not-found-title {
          font-family: var(--font-display);
          font-size: 3rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: var(--c-ink);
        }
        .not-found-text {
          font-size: 1.1rem;
          color: var(--c-ink-soft);
          margin-bottom: 3rem;
          line-height: 1.6;
        }
        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .not-found-btn {
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }
        .not-found-btn.primary {
          background: var(--c-terracotta);
          color: #fff;
        }
        .not-found-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(184, 85, 58, 0.2);
        }
        .not-found-btn.secondary {
          background: var(--c-parchment-deep);
          border: 1px solid var(--c-border);
          color: var(--c-ink);
        }
        .not-found-btn.secondary:hover {
          background: var(--c-border-light);
        }
        .not-found-bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20vw;
          font-weight: 900;
          pointer-events: none;
          z-index: 1;
          letter-spacing: -0.05em;
        }
        @media (max-width: 600px) {
          .not-found-title { font-size: 2.2rem; }
          .not-found-actions { flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
