/**
 * DesignCustomizer.tsx
 *
 * Floating design lab panel — toggle with the "T" key (for Tweak) or the
 * paint-palette button in the bottom-right corner.
 *
 * Allows switching between 4 visual palettes, density modes, font scales,
 * and border styles. All settings persist via localStorage.
 */

import { useEffect, useState } from "react";
import { useCustomizer, type Palette, type Density, type FontScale, type BorderStyle } from "../hooks/useCustomizer";
import { useTheme } from "../hooks/useTheme";

/* ── Palette metadata ──────────────────────────────────────────────────────── */
const PALETTES: { id: Palette; name: string; desc: string; swatch: string[] }[] = [
  {
    id: "parchment",
    name: "Parchment",
    desc: "Warm terracotta · Scholarly warmth",
    swatch: ["#f5f0e8", "#b8553a", "#c4882d"],
  },
  {
    id: "scholar",
    name: "Scholar",
    desc: "Navy × Gold · Academic gravitas",
    swatch: ["#f2f0ed", "#1a3a5c", "#c4982d"],
  },
  {
    id: "heritage",
    name: "Heritage",
    desc: "Forest green × Copper · Gujarat roots",
    swatch: ["#f4f2ee", "#2d5a27", "#8b6f47"],
  },
  {
    id: "midnight",
    name: "Midnight",
    desc: "Near-black × Coral · Dense & focused",
    swatch: ["#0d1117", "#161b22", "#e07b54"],
  },
];

export default function DesignCustomizer() {
  const [open, setOpen] = useState(false);
  const { palette, density, fontScale, borderStyle, setPalette, setDensity, setFontScale, setBorderStyle, reset } = useCustomizer();
  const { dark, toggle } = useTheme();

  // Toggle on "T" key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "t" || e.key === "T") setOpen(o => !o);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Floating trigger button */}
      <button
        className="customizer-trigger"
        onClick={() => setOpen(o => !o)}
        title="Design Lab (T)"
        aria-label="Open design customizer"
        aria-expanded={open}
      >
        <span className="customizer-trigger-icon">
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
            </svg>
          )}
        </span>
        <span className="customizer-trigger-kbd">T</span>
      </button>

      {/* Panel */}
      {open && (
        <aside className="customizer-panel" role="dialog" aria-label="Design Lab">
          <div className="customizer-header">
            <div>
              <h2 className="customizer-title">Design Lab</h2>
              <p className="customizer-subtitle">Explore visual configurations</p>
            </div>
            <button className="customizer-close" onClick={() => setOpen(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Palette section */}
          <section className="customizer-section">
            <h3 className="customizer-section-title">Colour Palette</h3>
            <div className="customizer-palette-grid">
              {PALETTES.map(p => (
                <button
                  key={p.id}
                  className={`customizer-palette-card${palette === p.id ? " active" : ""}`}
                  onClick={() => setPalette(p.id)}
                  title={p.desc}
                >
                  <div className="palette-swatches">
                    {p.swatch.map((c, i) => (
                      <span key={i} className="palette-swatch" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="palette-name">{p.name}</span>
                  <span className="palette-desc">{p.desc}</span>
                  {palette === p.id && (
                    <span className="palette-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Appearance */}
          <section className="customizer-section">
            <h3 className="customizer-section-title">Appearance</h3>
            <div className="customizer-row">
              <span className="customizer-row-label">Mode</span>
              <div className="customizer-toggle-group">
                <button
                  className={`customizer-toggle${!dark ? " active" : ""}`}
                  onClick={() => dark && toggle()}
                  disabled={palette === "midnight"}
                >☀️ Light</button>
                <button
                  className={`customizer-toggle${dark ? " active" : ""}`}
                  onClick={() => !dark && toggle()}
                >🌙 Dark</button>
              </div>
            </div>
          </section>

          {/* Density */}
          <section className="customizer-section">
            <h3 className="customizer-section-title">Layout Density</h3>
            <div className="customizer-row">
              <span className="customizer-row-label">Spacing</span>
              <div className="customizer-toggle-group">
                <button
                  className={`customizer-toggle${density === "normal" ? " active" : ""}`}
                  onClick={() => setDensity("normal" as Density)}
                >Normal</button>
                <button
                  className={`customizer-toggle${density === "compact" ? " active" : ""}`}
                  onClick={() => setDensity("compact" as Density)}
                >Compact</button>
              </div>
            </div>
            <div className="customizer-row">
              <span className="customizer-row-label">Type scale</span>
              <div className="customizer-toggle-group">
                <button
                  className={`customizer-toggle${fontScale === "normal" ? " active" : ""}`}
                  onClick={() => setFontScale("normal" as FontScale)}
                >Normal</button>
                <button
                  className={`customizer-toggle${fontScale === "large" ? " active" : ""}`}
                  onClick={() => setFontScale("large" as FontScale)}
                >Large</button>
              </div>
            </div>
            <div className="customizer-row">
              <span className="customizer-row-label">Borders</span>
              <div className="customizer-toggle-group">
                <button
                  className={`customizer-toggle${borderStyle === "normal" ? " active" : ""}`}
                  onClick={() => setBorderStyle("normal" as BorderStyle)}
                >Subtle</button>
                <button
                  className={`customizer-toggle${borderStyle === "heavy" ? " active" : ""}`}
                  onClick={() => setBorderStyle("heavy" as BorderStyle)}
                >Heavy</button>
              </div>
            </div>
          </section>

          <div className="customizer-footer">
            <button className="customizer-reset" onClick={reset}>
              ↺ Reset to defaults
            </button>
            <span className="customizer-hint">Press T to toggle</span>
          </div>
        </aside>
      )}

      {/* Backdrop */}
      {open && <div className="customizer-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}
