import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKS } from '../data/content';

export function IsbnLookup() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof BOOKS>([]);

  const search = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const lower = q.toLowerCase();
    const filtered = BOOKS.filter(book => 
      book.title.toLowerCase().includes(lower) ||
      book.titleGu?.includes(q) ||
      book.isbn?.includes(q) ||
      book.asin?.toLowerCase().includes(lower) ||
      book.publisher?.toLowerCase().includes(lower)
    );
    setResults(filtered);
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'transparent',
          border: '1.5px solid var(--c-terracotta)',
          color: 'var(--c-terracotta)',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        🔍 Search by ISBN
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '10vh',
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 600,
                maxHeight: '70vh',
                background: 'var(--c-parchment)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--c-border)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    margin: 0,
                  }}>
                    Search Collection
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      color: 'var(--c-ink-muted)',
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Search input */}
                <div style={{
                  position: 'relative',
                }}>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => search(e.target.value)}
                    placeholder="Search by title, ISBN, author, or publisher..."
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: '1.5px solid var(--c-border)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)',
                      background: 'var(--c-parchment-deep)',
                      color: 'var(--c-ink)',
                      outline: 'none',
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.2rem',
                    opacity: 0.5,
                  }}>
                    🔍
                  </span>
                </div>
              </div>

              {/* Results */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
              }}>
                {query && results.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--c-ink-muted)',
                  }}>
                    <p>No books found matching "{query}"</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      Try searching by title, ISBN, or publisher name.
                    </p>
                  </div>
                )}

                {results.map((book, index) => (
                  <motion.div
                    key={book.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      background: 'var(--c-parchment-deep)',
                      borderRadius: '8px',
                      border: '1px solid var(--c-border-light)',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      // Navigate to book detail
                      window.location.href = `/books#${BOOKS.indexOf(book)}`;
                      setIsOpen(false);
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem',
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}>
                        {book.title}
                      </div>
                      {book.locSelected && (
                        <span style={{
                          fontSize: '0.6rem',
                          padding: '2px 6px',
                          background: 'var(--c-amber)',
                          color: 'white',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}>
                          LOC
                        </span>
                      )}
                    </div>

                    {book.titleGu && (
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--c-ink-muted)',
                        marginBottom: '0.5rem',
                      }}>
                        {book.titleGu}
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.75rem',
                      color: 'var(--c-ink-muted)',
                    }}>
                      {book.isbn && <span>ISBN: {book.isbn}</span>}
                      {book.asin && <span>ASIN: {book.asin}</span>}
                      {book.year && <span>{book.year}</span>}
                      {book.publisher && <span>{book.publisher}</span>}
                    </div>
                  </motion.div>
                ))}

                {!query && (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--c-ink-muted)',
                  }}>
                    <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</p>
                    <p>Search through {BOOKS.length} books by Dr. Praduman Khachar</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      You can search by title, ISBN, Gujarati title, or publisher.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
