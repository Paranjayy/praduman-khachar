/**
 * useCustomizer.tsx
 *
 * Context + hook for the design customizer panel.
 * Manages palette, dark/light, density, font-scale, border-style.
 * All settings persisted to localStorage and applied as data-* attrs on <html>.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Palette = "parchment" | "scholar" | "heritage" | "midnight";
export type Density = "normal" | "compact";
export type FontScale = "normal" | "large";
export type BorderStyle = "normal" | "heavy";

interface CustomizerState {
  palette: Palette;
  density: Density;
  fontScale: FontScale;
  borderStyle: BorderStyle;
}

interface CustomizerContextValue extends CustomizerState {
  setPalette: (p: Palette) => void;
  setDensity: (d: Density) => void;
  setFontScale: (f: FontScale) => void;
  setBorderStyle: (b: BorderStyle) => void;
  reset: () => void;
}

const DEFAULTS: CustomizerState = {
  palette: "parchment",
  density: "normal",
  fontScale: "normal",
  borderStyle: "normal",
};

const KEY = "design-customizer";

function load(): CustomizerState {
  try {
    const s = localStorage.getItem(KEY);
    if (s) return { ...DEFAULTS, ...JSON.parse(s) };
  } catch (err) {}
  return DEFAULTS;
}

function save(state: CustomizerState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function applyToDOM(state: CustomizerState) {
  const h = document.documentElement;
  // Palette — midnight forces dark
  h.dataset.palette = state.palette;
  if (state.palette === "midnight") {
    h.dataset.theme = "dark";
    localStorage.setItem("theme", "dark");
  }
  // Density
  h.dataset.density = state.density;
  // Font scale
  h.dataset.fontscale = state.fontScale;
  // Border style
  h.dataset.borderstyle = state.borderStyle;
}

const CustomizerContext = createContext<CustomizerContextValue>({
  ...DEFAULTS,
  setPalette: () => {},
  setDensity: () => {},
  setFontScale: () => {},
  setBorderStyle: () => {},
  reset: () => {},
});

export function CustomizerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CustomizerState>(load);

  useEffect(() => {
    applyToDOM(state);
    save(state);
  }, [state]);

  const setPalette = (palette: Palette) => setState(s => ({ ...s, palette }));
  const setDensity = (density: Density) => setState(s => ({ ...s, density }));
  const setFontScale = (fontScale: FontScale) => setState(s => ({ ...s, fontScale }));
  const setBorderStyle = (borderStyle: BorderStyle) => setState(s => ({ ...s, borderStyle }));
  const reset = () => setState(DEFAULTS);

  return (
    <CustomizerContext.Provider value={{ ...state, setPalette, setDensity, setFontScale, setBorderStyle, reset }}>
      {children}
    </CustomizerContext.Provider>
  );
}

export function useCustomizer(): CustomizerContextValue {
  return useContext(CustomizerContext);
}
