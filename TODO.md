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
