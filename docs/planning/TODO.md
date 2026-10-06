# TODO — Upcoming tasks & ideas

A living checklist. Strike through (`~~text~~`) as you complete items.

---

## 🔥 High priority (do first)

- [ ] **Re-export Aaradhak book as a readable PDF** — see `FEATURE_IDEAS.md` § "How to give me the book" for the 4 options. My pick: **Adobe Acrobat Pro → Save as Searchable Image** (5 min). Or phone photos of each page (~10 min). I will not publish any book content.
- [ ] **Send front/back covers + ISBNs of his books** (you mentioned this would be coming)
- [ ] **Provide Fulchhab column name** (if it has a specific name beyond "Fulchhab Column")
- [ ] **Provide column name for any other unnamed columns**

## 🛠️ Next round (deferred but parked)

### Gallery & content
- [ ] **OCR each gallery image** to extract headlines + topics + dates (needs Tesseract or cloud OCR setup) — feeds search/filter
- [ ] **Topic-based filtering** in gallery (Kathi / Princely States / Folk Arts / etc.)
- [ ] **Sort/move low-res images** to the back or filter them out — tame the collection
- [ ] **"On This Day" widget** on home page — historical event from his video archive matching today's date
- [ ] **PDF reader** for books (when you send PDFs)
- [ ] **Watermark pipeline** (sharp at build time) for the HD/SD two-tier model
- [ ] **Membership tier** (auth, payment, signed URLs) — **Defer to CMS phase**

### CMS (Convex, not Supabase)
- [ ] **Convex schema design** — books, clippings, achievements, users, subscriptions
- [ ] **Convex auth setup** (magic link via Resend)
- [ ] **Razorpay integration** for membership payments
- [ ] **/admin route** rewrite with Convex-backed CRUD
- [ ] **Your father's onboarding guide** (simple doc with screenshots)
- [ ] **YouTube Studio-like dashboard** for him to:
  - See real subscriber/view counts live
  - Manage his column clippings
  - Edit book metadata
  - See donation/support activity
  - Get notified of important events (mentions, new followers, etc.)

### Polish & quirks
- [ ] **Fix Gujarati text rendering** — investigate Noto Sans Gujarati loading
- [ ] **Mobile menu overflow** on phones <360px
- [ ] **Touch pinch-zoom in lightbox** (currently only button zoom)
- [ ] **Book detail TOC** — long TOCs need scroll-to-chapter anchors
- [ ] **Hero marquee** — items cut off on narrow viewports
- [ ] **Service worker / PWA** — offline support
- [ ] **Print stylesheet** for BookDetail — more thorough
- [ ] **404 page** — currently generic, could have "back to safety" theme
- [ ] **Trailing slash redirects** — `/about` vs `/about/` consistency

## 💡 Ideas you mentioned (capture-all)

- [ ] **Better YT Studio-like dashboard for your father** — you mentioned this, see above
- [ ] **Robust analytics** — Vercel Web Analytics is already wired, but you can also pull live numbers via API (need Vercel API token from you)
- [ ] **Newsletter** (Resend / Buttondown) for followers who don't use YouTube
- [ ] **Real i18n** (replace Google Translate hack with proper translated bundles)
- [ ] **AI Research Assistant** — "Ask the archive" search across all video transcripts (moonshot)
- [ ] **Interactive Saurashtra map** — pin all 222 princely states
- [ ] **Audio podcast feed** from YouTube videos
- [ ] **Book marketplace** — direct purchase / shipping for out-of-print books

## 🐛 Known issues / things you've flagged

- [ ] **Gallery slow in Safari** — likely because the manifest + ~345 images load at once. Need: lazy loading is already there, but consider code-splitting the Gallery or showing a virtual scroll. Currently 100MB+ of images load on first visit.
- [ ] **P favicon on homepage** — REPLACED with custom temple SVG favicon (in flight)
- [ ] **Lokkalan Ni Vato** → REPLACED with **Lok Katha Ni Vato** (લોક કથા ની વાતો) — user correction, deployed

## 🤝 Workflow notes

- You do **yolo deploy** — I just commit + push to main, Vercel auto-deploys
- I track things in `FEATURE_IDEAS.md` (long-term roadmap) + `TODO.md` (this file, short-term actionable)
- For privacy, I never publish or quote large passages from anything you send me without your explicit OK
- Git config: `Paranjay <kparanjay245@gmail.com>` (switched from `dev@praduman.com`)

---

*Last updated: 2026-07-14 — after gallery update + naming corrections*

## 🌐 Language switcher

- [x] Change "EN" → "English" (full label, more accessible)
- [ ] Add proper i18n with translated JSON bundles (replace Google Translate hack) — fixes Hindi/Gujarati translation errors
- [ ] Persist language preference across visits

## 📩 Contact form (improved 2026-07-14)

- [x] Rename header "Dr. Khachar" → "Dr. Praduman Khachar"
- [x] Add "Work in progress" banner explaining the mailto: fallback limitation
- [x] localStorage draft persistence (auto-save every 600ms while typing)
- [x] Draft restoration notice on page load
- [x] Character counter (5000 limit) with warning
- [x] "Clear draft" button
- [x] "Draft auto-saved" indicator with timestamp
- [x] Submit button changes label when in WIP mode ("Open Email Client")
- [ ] Wire up Formspree (replace placeholder `xbljonpz` with real form ID) so long messages don't truncate

## 🎬 YouTube Studio-like dashboard (your father's self-service nocode) — PRIORITY

You specifically mentioned: "yt studio like roubst cms and anallytics soon for my father to fix or add himself kinda like nocode"

A full nocode dashboard for your father to manage his own portfolio. Not a CMS in the marketing sense — a **real YouTube-Studio-equivalent** for his site.

### What it should do
- **Real-time subscriber & view counts** pulled from YouTube Data API (no mockups)
- **Growth charts** — daily/weekly/monthly subscriber and view deltas with sparklines
- **Video manager** — see all 575+ videos, search transcripts, edit metadata, mark featured
- **Book manager** — edit title, ISBN, description, cover image, add endorsements
- **Column manager** — upload new clippings, tag by outlet/date/topic, publish/unpublish
- **Press / media mentions** — log new newspaper mentions, link to source
- **Achievements** — add/edit awards with date and source
- **Inbox** — see contact form submissions, mark as replied, archive
- **Donation ledger** — see UPI/Razorpay transactions, total month/year totals
- **Site analytics** — Vercel Analytics numbers (visitors, top pages, devices, countries)
- **Subscriber notification** — when something important happens (someone wants to book a talk, etc.)
- **Activity log** — every change is logged with who/when
- **Bulk operations** — select 20 books, change category, done
- **Image upload** — drag-drop into the form, auto-processes (resize, compress, generate thumbnails)

### Tech stack (recommended)
- **Convex** (your call) — real-time reactive DB, perfect for live dashboards
- **Resend** for email auth (magic link)
- **Razorpay** for payments / membership
- **Vercel Blob or S3** for image storage (the 100MB gallery images shouldn't live in git)
- **YouTube Data API** for live channel stats
- **Sharp** (serverless function) for image processing

### Phases
1. **Phase 1 (1 day)** — Auth + protected `/admin` route + Convex schema
2. **Phase 2 (2 days)** — Book manager + column clipping manager (upload, edit, delete)
3. **Phase 3 (1 day)** — YouTube API integration + real subscriber/view counts
4. **Phase 4 (1 day)** — Razorpay + membership ledger
5. **Phase 5 (1 day)** — Vercel Analytics integration + Polish

**Total estimate: 6-7 days** for a real working nocode dashboard.

## 📩 Translation fixes (later)

- [ ] Fix Google Translate hijacking the layout (it sometimes breaks the Gujarati/Hindi text and styling)
- [ ] Replace with proper i18n setup (i18next or react-intl) with translated content bundles
- [ ] Test all pages in EN/GU/HI after fix

## 🐛 Performance / Safari gallery

- [ ] Gallery slow in Safari (100MB+ images load at once) — needs virtual scroll or code-splitting
- [ ] Test on actual mobile Safari (iOS) — different from desktop

