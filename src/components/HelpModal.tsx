import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";
import { useEffect, useCallback } from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  desc: string;
}

const sections: { title: string; shortcuts: Shortcut[] }[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["G", "H"], desc: "Go to Home" },
      { keys: ["G", "B"], desc: "Go to Books" },
      { keys: ["G", "M"], desc: "Go to Media" },
      { keys: ["G", "E"], desc: "Go to Explore" },
      { keys: ["G", "L"], desc: "Go to Lineage" },
    ],
  },
  {
    title: "Search",
    shortcuts: [
      { keys: ["⌘", "K"], desc: "Command Palette" },
      { keys: ["/"], desc: "Quick Search" },
    ],
  },
  {
    title: "View",
    shortcuts: [
      { keys: ["↑", "↓"], desc: "Navigate items" },
      { keys: ["J", "K"], desc: "Navigate items" },
      { keys: ["Enter"], desc: "Select" },
      { keys: ["Esc"], desc: "Close / Back" },
    ],
  },
];

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="help-overlay" onClick={onClose}>
          <motion.div
            className="help-card"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="help-close"
              onClick={onClose}
              aria-label="Close help modal"
            >
              <X size={20} />
            </button>

            <header className="help-header">
              <Keyboard size={22} strokeWidth={2.5} />
              <h2>Keyboard Shortcuts</h2>
            </header>

            <div className="help-grid">
              {sections.map((section) => (
                <section key={section.title} className="help-section">
                  <h3 className="help-section-title">{section.title}</h3>
                  <ul className="help-shortcuts">
                    {section.shortcuts.map((s) => (
                      <li
                        key={s.desc + s.keys.join("")}
                        className="help-shortcut"
                      >
                        <span className="help-keys">
                          {s.keys.map((k, i) => (
                            <span key={i} className="help-kbd">
                              {k}
                            </span>
                          ))}
                        </span>
                        <span className="help-desc">{s.desc}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <footer className="help-footer">
              Press <kbd>Esc</kbd> or click outside to close
            </footer>
          </motion.div>

          <style>{`
            .help-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.7);
              backdrop-filter: blur(10px);
              z-index: 2000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1.5rem;
            }

            .help-card {
              background: var(--c-parchment);
              width: 100%;
              max-width: 680px;
              max-height: 85vh;
              overflow-y: auto;
              border-radius: 16px;
              border: 1px solid var(--c-border);
              position: relative;
              box-shadow: 0 32px 64px rgba(0, 0, 0, 0.45),
                          0 0 0 1px rgba(255, 255, 255, 0.04) inset;
            }
            [data-theme="dark"] .help-card {
              background: #111;
              border-color: rgba(255, 255, 255, 0.08);
            }

            .help-close {
              position: absolute;
              top: 1.25rem;
              right: 1.25rem;
              width: 36px;
              height: 36px;
              border-radius: 8px;
              background: rgba(0, 0, 0, 0.04);
              border: 1px solid transparent;
              color: var(--c-ink-soft);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.15s ease;
            }
            .help-close:hover {
              color: var(--c-ink);
              background: rgba(0, 0, 0, 0.08);
              border-color: var(--c-border);
            }
            [data-theme="dark"] .help-close { color: rgba(255,255,255,0.5); }
            [data-theme="dark"] .help-close:hover { color: #fff; background: rgba(255,255,255,0.08); }

            .help-header {
              padding: 2rem 2.25rem 1.5rem;
              display: flex;
              align-items: center;
              gap: 0.75rem;
              color: var(--c-terracotta);
              border-bottom: 1px solid var(--c-border-light);
            }
            .help-header h2 {
              font-family: var(--font-display);
              font-size: 1.35rem;
              font-weight: 700;
              margin: 0;
              color: var(--c-ink);
            }
            [data-theme="dark"] .help-header h2 { color: #f0ebe4; }

            .help-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem 2.5rem;
              padding: 2rem 2.25rem;
            }
            @media (max-width: 640px) {
              .help-grid { grid-template-columns: 1fr; gap: 1.75rem; }
            }

            .help-section-title {
              font-family: var(--font-sans);
              font-size: 0.7rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              color: var(--c-terracotta);
              margin: 0 0 0.85rem;
              padding-bottom: 0.5rem;
              border-bottom: 1px solid var(--c-border-light);
            }

            .help-shortcuts {
              list-style: none;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              gap: 0.6rem;
            }

            .help-shortcut {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 1rem;
            }

            .help-keys {
              display: flex;
              align-items: center;
              gap: 4px;
              flex-shrink: 0;
            }

            .help-kbd {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-width: 26px;
              height: 26px;
              padding: 0 6px;
              background: var(--c-parchment-deep);
              border: 1px solid var(--c-border);
              border-bottom-width: 2px;
              border-radius: 6px;
              font-family: var(--font-mono);
              font-size: 0.72rem;
              font-weight: 600;
              color: var(--c-ink);
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
              text-align: center;
            }
            [data-theme="dark"] .help-kbd {
              background: rgba(255, 255, 255, 0.06);
              border-color: rgba(255, 255, 255, 0.1);
              color: rgba(255, 255, 255, 0.85);
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }

            .help-desc {
              font-size: 0.88rem;
              color: var(--c-ink-soft);
              text-align: right;
            }
            [data-theme="dark"] .help-desc { color: rgba(255,255,255,0.5); }

            .help-footer {
              padding: 1rem 2.25rem;
              text-align: center;
              font-size: 0.75rem;
              color: var(--c-ink-muted);
              border-top: 1px solid var(--c-border-light);
              background: var(--c-parchment-deep);
            }
            [data-theme="dark"] .help-footer {
              background: #0a0a0a;
              border-color: rgba(255, 255, 255, 0.05);
              color: rgba(255, 255, 255, 0.35);
            }
            .help-footer kbd {
              display: inline-flex;
              align-items: center;
              padding: 1px 5px;
              background: rgba(0, 0, 0, 0.06);
              border: 1px solid var(--c-border);
              border-radius: 4px;
              font-family: var(--font-mono);
              font-size: 0.7rem;
            }
            [data-theme="dark"] .help-footer kbd {
              background: rgba(255,255,255,0.08);
              border-color: rgba(255,255,255,0.1);
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
