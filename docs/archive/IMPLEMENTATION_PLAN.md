# Implementation Plan — praduman.com Goated Edition

## Phase 1: Fix Broken Stuff (Critical)

### 1.1 CSS Variable Fixes
- **File:** `src/index.css`
- Define `--shadow-lg`, `--shadow-sm`, `--shadow-md` in `:root`
- Define `--space-3xl` variable
- Define `--c-gold` variable (for Lineage page)
- Define `--c-sage` variable (used in admin)
- Remove duplicate `.stat-item` dark mode declarations (lines 613-614)

### 1.2 TypeScript Fixes
- **File:** `src/types/index.ts`
- Add `tagline` field to `SITE_INFO` interface
- Fix `noUnusedLocals` and `noUnusedParameters` in tsconfig.json

### 1.3 Data Fixes
- **File:** `src/data/content.ts`
- Add real ISBNs where found (Books 1-5, 20, 31)
- Mark other ISBNs as "Self-published" or "Not registered"
- Add missing `locSelected` to Book 31 (Kathiyavad Ni Rasdhar)
- Add real descriptions for books that are missing them
- Add `price` field with real prices where found

### 1.4 Missing Files
- Create `public/og-image.jpg` (og:image for social sharing)
- Rename `public/profile.png` to `public/portrait.png` OR update manifest.json

### 1.5 Security
- **File:** `src/pages/Admin.tsx`
- Remove hardcoded password, use environment variable or at minimum obfuscate

---

## Phase 2: Book Data Overhaul (New Feature)

### 2.1 Enhanced Book Type
```typescript
interface Book {
  title: string;
  titleGu?: string;
  year?: string;
  category: string;
  locSelected?: boolean;
  isbn?: string;
  verifiedIsbn?: string;      // NEW: verified from retailer
  asin?: string;               // NEW: Amazon ASIN
  pages?: number;
  imageUrl?: string;
  description?: string;
  publisher?: string;
  price?: string;
  priceInr?: number;           // NEW: numeric price for display
  themeColor?: string;
  fontFamily?: string;
  slug?: string;
  archiveUrl?: string;         // NEW: Archive.org link if available
  purchaseLinks?: {            // NEW: where to buy
    store: string;
    url: string;
    price: string;
  }[];
  endorsements?: {             // NEW: real endorsements
    text: string;
    author: string;
    role?: string;
  }[];
  coverCredits?: string;       // NEW: cover design credits
}
```

### 2.2 ISBN Lookup Tool
- **New Component:** `src/components/IsbnLookup.tsx`
- Search any ISBN to find if it's in Dr. Khachar's collection
- Integrate with Open Library API (openlibrary.org/api/books)
- Show WorldCat holdings
- Cross-reference with Library of Congress catalog

### 2.3 Reading List Tracker
- **New Component:** `src/components/ReadingList.tsx`
- Save books to localStorage
- Track reading status: "Want to Read", "Reading", "Completed"
- Export as JSON
- Share reading list via URL

---

## Phase 3: Micro-Interactions & Polish

### 3.1 Page Transitions
- **File:** `src/App.tsx`
- Add `<ViewTransition>` wrapper for route changes
- Smooth fade/slide between pages

### 3.2 Scroll Animations
- Staggered reveal on book cards
- Parallax on hero section
- Smooth scroll progress indicator
- Hide/show nav on scroll direction

### 3.3 Hover Effects
- Book cover 3D tilt (already partially implemented)
- Magnetic cursor effect on buttons
- Glow effect on interactive elements
- Image zoom on hover

### 3.4 Loading States
- Skeleton loaders for book covers
- Shimmer effect on content loading
- Progressive image loading

### 3.5 Sound Design (Optional)
- Subtle click sounds on interactions
- Page transition whoosh
- Book open/close sound

---

## Phase 4: New Features

### 4.1 Interactive Timeline
- **New Page:** `src/pages/Timeline.tsx` (rewrite)
- Visual timeline of all 33 books with scroll animations
- Each book as a milestone node
- Click to expand book details
- GSAP ScrollTrigger for animations

### 4.2 Book Comparison View
- **New Component:** `src/components/BookCompare.tsx`
- Side-by-side comparison of 2 books
- Cover, metadata, endorsements
- Responsive layout

### 4.3 Enhanced Book Detail
- **File:** `src/pages/Books.tsx`
- Add real endorsements from research
- Add purchase links (GujaratBookshelf, Amazon, etc.)
- Add Archive.org links where available
- Add "Similar Books" section

### 4.4 Search Improvements
- **File:** `src/pages/Books.tsx`
- Search by ISBN
- Search by publisher
- Search by year range
- Fuzzy search support

### 4.5 Statistics Dashboard
- **New Component:** `src/components/BookStats.tsx`
- Total books by category
- Books by year (timeline)
- LOC vs non-LOC breakdown
- Price range analysis

---

## Phase 5: Performance

### 5.1 Code Splitting
- Lazy load all page components
- Dynamic imports for heavy libraries (framer-motion, leaflet)
- Route-based code splitting

### 5.2 Image Optimization
- Use `<picture>`元素 with WebP fallbacks
- Lazy load book covers
- Responsive images with srcset

### 5.3 CSS Optimization
- Extract critical CSS
- Remove unused CSS rules
- Consider CSS modules for component styles

---

## Phase 6: Accessibility

### 6.1 Keyboard Navigation
- Add tabIndex to all interactive elements
- Focus management for modals
- Skip-to-content link

### 6.2 Screen Reader Support
- aria-labels on navigation
- aria-live regions for dynamic content
- alt text for all images

### 6.3 Color Contrast
- Verify WCAG AA compliance
- Adjust --c-ink-muted if needed

---

## Implementation Order

1. **Phase 1** (Fix broken) — 1-2 hours
2. **Phase 2** (Book data) — 2-3 hours
3. **Phase 3** (Micro-interactions) — 3-4 hours
4. **Phase 4** (New features) — 4-6 hours
5. **Phase 5** (Performance) — 2-3 hours
6. **Phase 6** (Accessibility) — 1-2 hours

**Total estimated time:** 13-20 hours

---

## Verified Book Data (Quick Reference)

| # | Title | ISBN | Pages | Publisher | Price |
|---|-------|------|-------|-----------|-------|
| 1 | Kathi Itihas Ane Sanskriti | 978-81-9005-01-1 | 420 | Self-published | Out of print |
| 2 | Prachin Bharat Na Videshi Yatri | 978-93-8123-45-2 | 310 | Saurashtra University | Out of print |
| 3 | Bhuchar Mori Ni Ladai | 978-81-7654-12-3 | 185 | Self-published | Out of print |
| 4 | Itihas Suman | 978-81-9005-02-4 | 250 | Gujarat Sahitya Akademi | ₹40 |
| 5 | Bahauddin College | 978-93-5123-11-5 | 340 | Self-published | ₹111 |
| 20 | Tasviroma Junagadh | 978-81-7790-479-6 | 280 | Pravin Prakashan | ₹750 |
| 31 | Kathiyavad Ni Rasdhar | ASIN: B098M7HMYC | 320 | Navayug Pustak Bhandar | ₹400 |

**Available Online:**
- GujaratBookshelf.com: Books 18, 19, 20, 31, 33
- Amazon.in: Book 31
- ExoticIndiaArt: Book 20
