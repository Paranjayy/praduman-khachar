# Future UI Kit & Color Palette Overhaul

> Status: **Planned** — Not started. Stabilize current codebase first.

## Current Issues

1. **Overlapping buttons** — Mobile bottom nav, floating action buttons (ReadingList, IsbnLookup, Compare FAB, BackToTop) all compete for the same screen real estate, especially on small viewports
2. **Visual consistency** — Some components use CSS variables (`--c-terracotta`, `--c-parchment`), others use hardcoded hex values. Need a unified design token system
3. **Dark mode gaps** — Not all components have proper dark mode styling; some elements are invisible or low-contrast in dark mode
4. **Spacing inconsistencies** — Mix of rem, px, and CSS variable-based spacing across components
5. **Typography scale** — No consistent type scale; font sizes are arbitrary across pages

## Phase 1: Design Token System

Replace all hardcoded colors/spacing with a proper token system.

### Color Tokens

```css
:root {
  /* Primary palette */
  --color-primary: #b8553a;         /* Terracotta */
  --color-primary-light: #d4734f;
  --color-primary-dark: #8a3a24;

  /* Accent */
  --color-accent: #c5a55a;          /* Gold */
  --color-accent-light: #dbc07a;
  --color-accent-dark: #9a7e3a;

  /* Neutrals */
  --color-bg: #f5f0e8;              /* Parchment */
  --color-bg-deep: #ebe4d6;
  --color-bg-surface: #ffffff;
  --color-ink: #2c2418;
  --color-ink-soft: #5a4f42;
  --color-ink-muted: #8a7f72;

  /* Borders */
  --color-border: #d4cfc4;
  --color-border-light: #e8e3da;

  /* Semantic */
  --color-success: #6b7c5e;
  --color-warning: #c5a55a;
  --color-error: #b8553a;
  --color-info: #5a7a8a;
}
```

### Spacing Scale

```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
}
```

### Type Scale

```css
:root {
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 3rem;
}
```

## Phase 2: Component Audit

### Overlapping Buttons Fix

The floating UI elements need a z-index and positioning strategy:

| Element | Current z-index | Proposed Position |
|---------|----------------|-------------------|
| Mobile Bottom Nav | 999 | Bottom center, fixed |
| BackToTop | auto | Bottom right, above bottom nav |
| ReadingList FAB | 1000 | Bottom right, above BackToTop |
| IsbnLookup | 1000 | Bottom left, fixed |
| Compare FAB | 998 | Bottom right, above ReadingList |

**Proposed layout (mobile):**
```
┌─────────────────────────────┐
│                             │
│       Page Content          │
│                             │
│              [Compare FAB]  │
│  [ISBN]        [Reading]    │
│              [↑ BackToTop]  │
├─────────────────────────────┤
│  🏠  📚  🔍  📺  👤       │  ← Mobile Bottom Nav
└─────────────────────────────┘
```

All floating buttons should sit ABOVE the mobile bottom nav but below modals/overlays.

### Dark Mode Audit

Files needing dark mode fixes:
- `ReadingList.tsx` — panel background, progress bars
- `CommandPalette.tsx` — search results hover states
- `HelpModal.tsx` — kbd key styling
- `BookDetail.tsx` — breadcrumbs, endorsement quotes
- `Books.tsx` — category distribution chart, empty state
- `MobileBottomNav.tsx` — active state color
- `ErrorBoundary.tsx` — error page styling

## Phase 3: Visual Refresh (After Token System)

### Option A: Warm Parchment (Evolution)
- Keep current warm/sepia palette
- Refine contrast ratios
- Add subtle texture overlays
- Better shadow system

### Option B: Modern Scholar (Revolution)
- Dark mode as default
- High contrast typography
- Minimal borders, more whitespace
- Accent color pops against neutral backgrounds

### Option C: Heritage Museum (Hybrid)
- Light mode default with warm tones
- Dark mode available with deep navy/charcoal
- Gold accents for interactive elements
- Cream/parchment for content areas
- Editorial serif typography

**Recommended:** Option C — respects the historical/scholarly nature of the site while feeling modern.

## Implementation Order

1. **Now:** Fix overlapping buttons on mobile (quick win)
2. **Next:** Add design tokens to CSS variables
3. **Then:** Migrate components to use tokens (one at a time)
4. **After:** Dark mode audit and fixes
5. **Finally:** Visual refresh if desired

## Notes

- All changes should be incremental and deployable independently
- No breaking changes — each phase should leave the site fully functional
- Test on mobile first (most issues are mobile-specific)
- Keep the existing terracotta + gold identity — just make it more consistent
