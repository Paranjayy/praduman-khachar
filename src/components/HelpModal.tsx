import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, MousePointer2, Zap, Search, BookOpen, Video, Map, Info } from "lucide-react";
import { useEffect } from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "?" && !isOpen) {
        // Toggle if not in input
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
           // We can't easily trigger the state from here without a global state, 
           // but the parent handles it.
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="help-modal-overlay" onClick={onClose}>
          <motion.div 
            className="help-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="help-modal-close" onClick={onClose}><X size={20} /></button>
            
            <header className="help-modal-header">
              <div className="help-modal-icon-wrap">
                <Info className="help-modal-icon" />
              </div>
              <div>
                <h2 className="help-modal-title">Workstation Guide</h2>
                <p className="help-modal-sub">Navigation & Scholar's Tools</p>
              </div>
            </header>

            <div className="help-modal-grid">
              <section className="help-section">
                <h3 className="help-section-title"><Keyboard size={16} /> Keyboard Shortcuts</h3>
                <div className="shortcut-list">
                  <div className="shortcut-item"><kbd>G</kbd> then <kbd>H</kbd> <span>Go Home</span></div>
                  <div className="shortcut-item"><kbd>G</kbd> then <kbd>B</kbd> <span>Go to Books</span></div>
                  <div className="shortcut-item"><kbd>G</kbd> then <kbd>M</kbd> <span>Go to Media</span></div>
                  <div className="shortcut-item"><kbd>G</kbd> then <kbd>E</kbd> <span>Go to Explore</span></div>
                  <div className="shortcut-item"><kbd>⌘</kbd> + <kbd>K</kbd> <span>Command Palette</span></div>
                  <div className="shortcut-item"><kbd>?</kbd> <span>Show this guide</span></div>
                  <div className="shortcut-item"><kbd>Esc</kbd> <span>Close Modals</span></div>
                </div>
              </section>

              <section className="help-section">
                <h3 className="help-section-title"><Zap size={16} /> Advanced Features</h3>
                <div className="feature-tips">
                  <div className="feature-tip">
                    <Search className="tip-icon" />
                    <div>
                      <strong>Neural Search</strong>
                      <p>Use the Explore page to search transcripts across 575+ videos in Gujarati & English.</p>
                    </div>
                  </div>
                  <div className="feature-tip">
                    <BookOpen className="tip-icon" />
                    <div>
                      <strong>Stripe Press Detail</strong>
                      <p>Click any book to enter the endless scroll bibliography with 3D cover interactions.</p>
                    </div>
                  </div>
                  <div className="feature-tip">
                    <Map className="tip-icon" />
                    <div>
                      <strong>Historical Mapping</strong>
                      <p>Explore the Interactive Map to see locations mentioned in Dr. Khachar's research.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <footer className="help-modal-footer">
              <p>v2.8.5-GOD WORKSTATION • Developed for Scholarly Archiving</p>
            </footer>
          </motion.div>

          <style>{`
            .help-modal-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.8);
              backdrop-filter: blur(8px);
              z-index: 2000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
            }
            .help-modal-content {
              background: var(--c-parchment);
              width: 100%;
              max-width: 800px;
              border-radius: 20px;
              border: 1px solid var(--c-border);
              position: relative;
              overflow: hidden;
              box-shadow: 0 30px 60px rgba(0,0,0,0.5);
            }
            [data-theme="dark"] .help-modal-content {
              background: #111;
              border-color: rgba(255,255,255,0.1);
            }
            .help-modal-close {
              position: absolute;
              top: 1.5rem;
              right: 1.5rem;
              background: none;
              border: none;
              color: var(--c-ink-soft);
              cursor: pointer;
              transition: 0.2s;
            }
            .help-modal-close:hover { color: var(--c-terracotta); }
            
            .help-modal-header {
              padding: 2.5rem;
              border-bottom: 1px solid var(--c-border-light);
              display: flex;
              align-items: center;
              gap: 1.5rem;
              background: linear-gradient(to right, rgba(184, 85, 58, 0.05), transparent);
            }
            .help-modal-icon-wrap {
              width: 50px;
              height: 50px;
              background: var(--c-terracotta);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
            }
            .help-modal-title {
              font-family: var(--font-display);
              font-size: 1.5rem;
              margin: 0;
              color: var(--c-ink);
            }
            [data-theme="dark"] .help-modal-title { color: #fff; }
            .help-modal-sub {
              font-size: 0.85rem;
              color: var(--c-ink-soft);
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            .help-modal-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 3rem;
              padding: 2.5rem;
            }
            @media (max-width: 700px) {
              .help-modal-grid { grid-template-columns: 1fr; gap: 2rem; }
            }

            .help-section-title {
              font-family: var(--font-sans);
              font-size: 0.75rem;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: var(--c-terracotta);
              margin-bottom: 1.5rem;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .shortcut-list { display: flex; flex-direction: column; gap: 0.8rem; }
            .shortcut-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 0.95rem;
              color: var(--c-ink);
            }
            [data-theme="dark"] .shortcut-item { color: rgba(255,255,255,0.8); }
            .shortcut-item kbd {
              background: var(--c-parchment-deep);
              border: 1px solid var(--c-border);
              padding: 2px 6px;
              border-radius: 4px;
              font-family: var(--font-mono);
              font-size: 0.75rem;
              min-width: 24px;
              text-align: center;
              box-shadow: 0 2px 0 var(--c-border);
            }
            .shortcut-item span { margin-left: auto; color: var(--c-ink-soft); font-size: 0.85rem; }

            .feature-tips { display: flex; flex-direction: column; gap: 1.5rem; }
            .feature-tip { display: flex; gap: 1rem; }
            .tip-icon { color: var(--c-terracotta); flex-shrink: 0; margin-top: 2px; }
            .feature-tip strong { display: block; font-size: 0.95rem; margin-bottom: 2px; color: var(--c-ink); }
            [data-theme="dark"] .feature-tip strong { color: #fff; }
            .feature-tip p { font-size: 0.85rem; color: var(--c-ink-soft); line-height: 1.4; margin: 0; }

            .help-modal-footer {
              padding: 1.5rem 2.5rem;
              background: var(--c-parchment-deep);
              border-top: 1px solid var(--c-border-light);
              text-align: center;
            }
            [data-theme="dark"] .help-modal-footer { background: #0a0a0a; border-color: rgba(255,255,255,0.05); }
            .help-modal-footer p { font-size: 0.7rem; color: var(--c-ink-muted); margin: 0; letter-spacing: 0.02em; }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
