import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface FlipBookPortalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pages: string[];
}

export function FlipBookPortal({ isOpen, onClose, title, pages }: FlipBookPortalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const next = () => setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
  const prev = () => setCurrentPage((p) => Math.max(0, p - 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="flipbook-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(20px)',
            padding: '2rem'
          }}
        >
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={32} />
          </button>

          <div className="flipbook-container" style={{ position: 'relative', perspective: '1500px', width: 'min(900px, 90vw)', height: 'min(600px, 70vh)' }}>
            <div className="flipbook-inner" style={{ width: '100%', height: '100%', display: 'flex', gap: '2px' }}>
              
              {/* Left Page (Previous) */}
              <motion.div 
                className="flipbook-page left"
                key={`left-${currentPage}`}
                initial={{ rotateY: -10 }}
                animate={{ rotateY: 0 }}
                style={{ 
                  flex: 1, 
                  background: '#fcfaf2', 
                  borderRadius: '4px 0 0 4px', 
                  boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  transformOrigin: 'right center'
                }}
              >
                {currentPage > 0 ? (
                  <img src={pages[currentPage - 1]} alt="Page" style={{ width: '200%', height: '100%', objectFit: 'cover', transform: 'translateX(-50%)' }} />
                ) : (
                  <div style={{ padding: '4rem', color: '#8a7b5a', fontFamily: 'var(--font-serif)' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{title}</h1>
                    <div style={{ height: '2px', background: '#8a7b5a', width: '40%', marginBottom: '2rem' }} />
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                      Selected archival previews from the masterpiece research by Dr. Praduman Khachar.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Right Page (Current) */}
              <motion.div 
                className="flipbook-page right"
                key={`right-${currentPage}`}
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                style={{ 
                  flex: 1, 
                  background: '#fcfaf2', 
                  borderRadius: '0 4px 4px 0', 
                  boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  transformOrigin: 'left center'
                }}
              >
                <img src={pages[currentPage]} alt="Page" style={{ width: '200%', height: '100%', objectFit: 'cover' }} />
              </motion.div>

              {/* Controls Overlay */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  disabled={currentPage === 0}
                  style={{ 
                    pointerEvents: 'auto', 
                    background: 'rgba(255,255,255,0.1)', 
                    border: 'none', 
                    width: '60px', 
                    cursor: 'pointer',
                    opacity: currentPage === 0 ? 0 : 1,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <ChevronLeft size={40} color="white" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  disabled={currentPage === pages.length - 1}
                  style={{ 
                    pointerEvents: 'auto', 
                    background: 'rgba(255,255,255,0.1)', 
                    border: 'none', 
                    width: '60px', 
                    cursor: 'pointer',
                    opacity: currentPage === pages.length - 1 ? 0 : 1,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <ChevronRight size={40} color="white" />
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', color: 'white', opacity: 0.7, fontSize: '0.9rem' }}>
            Page {currentPage + 1} of {pages.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
