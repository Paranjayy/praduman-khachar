import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, BOOK_CATEGORIES } from '../data/content';

interface ReadingListBook {
  title: string;
  status: 'want-to-read' | 'reading' | 'completed';
  addedAt: number;
}

export function ReadingList() {
  const [isOpen, setIsOpen] = useState(false);
  const [readingList, setReadingList] = useState<ReadingListBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('readingList');
    if (saved) {
      setReadingList(JSON.parse(saved));
    }
  }, []);

  const addToReadingList = (title: string, status: ReadingListBook['status'] = 'want-to-read') => {
    const newList = [...readingList, { title, status, addedAt: Date.now() }];
    setReadingList(newList);
    localStorage.setItem('readingList', JSON.stringify(newList));
  };

  const removeFromReadingList = (title: string) => {
    const newList = readingList.filter(item => item.title !== title);
    setReadingList(newList);
    localStorage.setItem('readingList', JSON.stringify(newList));
  };

  const updateStatus = (title: string, status: ReadingListBook['status']) => {
    const newList = readingList.map(item => 
      item.title === title ? { ...item, status } : item
    );
    setReadingList(newList);
    localStorage.setItem('readingList', JSON.stringify(newList));
  };

  const isInList = (title: string) => readingList.some(item => item.title === title);

  const getStatusColor = (status: ReadingListBook['status']) => {
    switch (status) {
      case 'want-to-read': return '#c5a55a';
      case 'reading': return '#6b7c5e';
      case 'completed': return '#b8553a';
    }
  };

  const getStatusLabel = (status: ReadingListBook['status']) => {
    switch (status) {
      case 'want-to-read': return 'Want to Read';
      case 'reading': return 'Currently Reading';
      case 'completed': return 'Completed';
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="reading-list-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '6rem',
          right: '2rem',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--c-terracotta)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(184, 85, 58, 0.4)',
          zIndex: 1000,
          fontSize: '1.5rem',
        }}
      >
        📚
        {readingList.length > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#c5a55a',
            color: '#1a1612',
            fontSize: '0.7rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {readingList.length}
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="reading-list-panel"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 400,
              maxWidth: '90vw',
              background: 'var(--c-parchment)',
              borderLeft: '1px solid var(--c-border)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--c-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '1.25rem',
                  margin: 0,
                }}>
                  Reading List
                </h3>
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--c-ink-muted)', 
                  margin: '4px 0 0',
                }}>
                  {readingList.length} book{readingList.length !== 1 ? 's' : ''}
                </p>
              </div>
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

            {/* List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
            }}>
              {readingList.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: 'var(--c-ink-muted)',
                }}>
                  <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</p>
                  <p>Your reading list is empty.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Click the "Add to Reading List" button on any book to start building your collection.
                  </p>
                </div>
              ) : (
                readingList.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      background: 'var(--c-parchment-deep)',
                      borderRadius: '8px',
                      border: '1px solid var(--c-border-light)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem',
                    }}>
                      <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                        <div style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          marginBottom: '4px',
                        }}>
                          {item.title}
                        </div>
                        <div style={{
                          fontSize: '0.7rem',
                          color: getStatusColor(item.status),
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          {getStatusLabel(item.status)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromReadingList(item.title)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--c-ink-muted)',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          padding: '4px',
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* Status buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                    }}>
                      {(['want-to-read', 'reading', 'completed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(item.title, status)}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: item.status === status ? getStatusColor(status) : 'transparent',
                            color: item.status === status ? 'white' : 'var(--c-ink-muted)',
                            border: `1px solid ${item.status === status ? getStatusColor(status) : 'var(--c-border)'}`,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {status === 'want-to-read' ? '📖' : status === 'reading' ? '📚' : '✓'}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Export */}
            {readingList.length > 0 && (
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--c-border)',
              }}>
                <button
                  onClick={() => {
                    const data = JSON.stringify(readingList, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'reading-list.json';
                    a.click();
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--c-terracotta)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  Export Reading List
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 1000,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
