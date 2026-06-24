import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BOOKS, BOOK_CATEGORIES } from '../data/content';

export function BookTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Group books by decade
  const decades = BOOKS.reduce((acc, book) => {
    const year = parseInt(book.year || '2000');
    const decade = Math.floor(year / 10) * 10;
    if (!acc[decade]) acc[decade] = [];
    acc[decade].push(book);
    return acc;
  }, {} as Record<number, typeof BOOKS>);

  return (
    <div ref={containerRef} className="book-timeline">
      {/* Animated line */}
      <motion.div 
        className="timeline-line"
        style={{ height: lineHeight }}
      />

      {Object.entries(decades).map(([decade, books], decadeIndex) => (
        <div key={decade} className="timeline-decade">
          <motion.div
            className="decade-marker"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: decadeIndex * 0.1 }}
          >
            <span className="decade-label">{decade}s</span>
          </motion.div>

          <div className="decade-books">
            {books.map((book, bookIndex) => {
              const globalIndex = BOOKS.indexOf(book);
              const isLeft = bookIndex % 2 === 0;
              
              return (
                <motion.div
                  key={book.title}
                  className={`timeline-book ${isLeft ? 'left' : 'right'}`}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ 
                    delay: bookIndex * 0.1,
                    type: 'spring',
                    damping: 20,
                    stiffness: 100,
                  }}
                >
                  <div className="book-year-badge">
                    {book.year}
                  </div>
                  
                  <motion.div
                    className="book-card-timeline"
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    }}
                    transition={{ type: 'spring', damping: 15 }}
                    onClick={() => {
                      const event = new CustomEvent('openBook', { detail: { index: globalIndex } });
                      window.dispatchEvent(event);
                    }}
                  >
                    {book.imageUrl && (
                      <div className="book-cover-timeline">
                        <img src={book.imageUrl} alt={book.title} />
                      </div>
                    )}
                    
                    <div className="book-info-timeline">
                      <div className="book-category-timeline">
                        {BOOK_CATEGORIES[book.category]}
                      </div>
                      <h3 className="book-title-timeline">{book.title}</h3>
                      {book.titleGu && (
                        <p className="book-gujarati-timeline">{book.titleGu}</p>
                      )}
                      <div className="book-meta-timeline">
                        {book.pages && <span>{book.pages} pages</span>}
                        {book.isbn && <span>ISBN: {book.isbn}</span>}
                      </div>
                      {book.locSelected && (
                        <div className="loc-badge-timeline">
                          🏛️ Library of Congress
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
