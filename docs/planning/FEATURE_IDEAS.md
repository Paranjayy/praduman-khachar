# Future Feature Ideas

A curated backlog of features for the Praduman Khachar portfolio site, ranked by impact-to-effort ratio. Pick and choose.

---

## ⚡ High value, low effort (ship in 1–2 hours each)

### 1. "On This Day in Saurashtra" widget
- Show a historical event from the YouTube archive matching today's date
- Placed in the Hero or as a dedicated section on the homepage
- Source: pre-baked JSON of `[{ date: "MM-DD", event: "...", videoId: "..." }]`
- Fetches the matching video on render and shows a thumbnail + link
- Why: adds daily freshness, encourages return visits, surfaces older content

### 2. Newsletter signup
- Resend / Buttondown / Mailchimp embedded form in the footer
- "Get notified when new videos drop" — single email field
- Why: gives visitors a way to follow without subscribing to YouTube; his audience skews older and may prefer email

### 3. Open Graph preview generator
- Each video article + each book gets a unique `og:image` with title + thumbnail baked in
- Use `@vercel/og` (ImageResponse) — serverless function at `/api/og/[slug]`
- Why: WhatsApp/Twitter previews of shared links currently look generic; branded previews = more clicks

### 4. Reading time estimates
- On book cards: "≈ 14h read" computed from `pages` field (≈ 2 min/page)
- On video articles: shows the actual video duration
- Why: helps visitors decide what to engage with

### 5. "Cite this book" generator
- One-click APA / MLA / Chicago citation for any book
- Copy-to-clipboard, shown in BookDetail sidebar
- Why: scholars and students will use this constantly

### 6. "Share this video at timestamp" deep-link
- On every video page, a shareable link auto-copies `?t=120s` based on current playback
- Why: makes it trivial to share a specific moment in a lecture

### 7. "Books cited in this video" reverse lookup
- Cross-reference video transcripts to detect when a book is mentioned
- Surface as a sidebar on video pages
- Why: turns passive watching into active research

---

## 🔨 Medium effort (1–3 days each)

### 8. PWA (installable + offline)
- `vite-plugin-pwa` + manifest.json + service worker
- Site installs to phone home screen, works offline after first visit
- Why: huge for users in areas with flaky internet (Gujarat tier-2/3 cities)

### 9. Real i18n (replace Google Translate)
- Proper `react-intl` or `i18next` setup with translated JSON bundles
- English / Gujarati / Hindi translations
- Why: the current Google Translate hijack is slow, breaks the layout, and doesn't translate content — only text

### 10. Razorpay-backed donations
- Real Razorpay payment link integration in Support component
- UPI deep-link + card/netbanking options
- Why: the `Support` component currently has `#` placeholders

### 11. PDF flipbook reader
- Embed a page-flip PDF viewer in BookDetail for books that have PDFs
- Use `react-pageflip` or similar
- Storage: put PDFs in `public/books/{slug}.pdf` (need to source from him)
- Why: the most "wow" feature for a book-centric site

### 12. YouTube RSS auto-import
- Cron-style GitHub Action that polls his YouTube channel daily
- Auto-runs the existing `scripts/gen-stats.mjs` + `scripts/gen-rss.mjs`
- Commits updated `videos.json` + `feed.json` + `rss.xml`
- Why: site stays current without manual intervention

### 13. Real Vercel Analytics dashboard
- Serverless function at `/api/stats` that calls Vercel Web Analytics API with a token
- Token stored in Vercel env, never exposed to client
- Display real visitor numbers + top pages + devices on `/stats` page
- Why: removes the "this is just localStorage" caveat

### 14. Search highlighting improvements
- Already have basic highlight — extend with:
  - Fuzzy matching (typo tolerance via `fuse.js`)
  - Search history dropdown
  - "Did you mean..." suggestions
  - Filter by category/era

### 15. Recently viewed books/videos
- Persistent sidebar showing last 5 viewed items
- Uses `useRecentlyViewed` hook (already exists, wire it up)
- Why: makes the site feel like a real research tool

---

## 🏗 Bigger builds (1–2 weeks each)

### 16. Interactive quiz mode
- "Test your knowledge of Saurashtra history"
- MCQs auto-generated from video transcripts via LLM
- Tracks score, shows progress, links to source video
- Why: gamification = engagement = retention

### 17. Audio article playback (TTS)
- Browser Speech Synthesis API to read any article aloud
- Gujarati voice + English voice toggle
- Why: accessibility + commute listening

### 18. Interactive Saurashtra map
- Mapbox / Leaflet map with all 222 princely states pinned
- Click a state → see books/videos that cover it
- Filter by era, dynasty, language
- Why: this is THE killer feature for a historian's site

### 19. Lineage / family tree explorer
- Visual graph (D3.js or react-flow) of the princely state dynasties
- Gohel, Kathi, Jhala, Solanki — interactive navigation
- Why: the "Lineage" page exists but is text-only

### 20. Admin dashboard
- Real-time YouTube/IG/FB sync with growth charts
- View counts, subscriber trends, post engagement
- Edit book metadata, upload new book covers
- Auth-gated (currently `/admin` route exists but unstyled)

### 21. Print-friendly book catalog
- "Print all 33 books as a PDF" — generates a beautiful catalog
- Use `react-pdf` or `puppeteer` in a serverless function
- Why: physical mailing list / press kit

---

## ✨ Polish & micro-improvements

### 22. Keyboard shortcut overlay
- Press `?` to show all shortcuts (already wired in `HelpModal` — just needs content)
- Document every shortcut: navigation (`g h`, `g b`, etc.), search (`⌘K`), theme (`t`), share (`s`)

### 23. Smoother dark mode transition
- Animate `background-color` and `color` on theme switch
- Currently it's instant — looks jarring

### 24. Command palette improvements
- Fuzzy search across books, videos, pages
- Recent commands section
- Action commands: "Copy current page URL", "Toggle theme", "Open stats"

### 25. Animated number counters
- The big "42k+ Subscribers" / "575 Videos" stats should count up on scroll into view
- Already exists in StatsRibbon — apply site-wide

### 26. Better empty states
- "No videos match your search" → suggest popular videos
- "No books in this category" → show full catalog
- All empty states should have personality, not just grey text

### 27. Confetti on book purchase / support click
- Subtle animation when someone clicks "Request Access" or "Support the Work"
- Library/raindrop themed (not generic confetti)

### 28. Reading progress indicator
- Bar at top of BookDetail showing scroll progress
- Saves last-read position to localStorage
- "Continue reading" prompt on return

### 29. Email-this-to-me
- "Email me this book details" button on BookDetail
- Opens pre-filled `mailto:` with the book's full record
- Why: he gets enquiries from researchers who want physical copies

### 30. Real ISBN lookup via OpenLibrary API
- When you search by ISBN, also fetch metadata from `openlibrary.org`
- Show cover, description, publication date even for books not in his catalog
- Why: he probably gets asked "do you have a book on X topic" — direct lookup helps

---

## 🧪 Experimental / moonshot

### 31. AI Research Assistant
- "Ask the archive" — chat interface that searches video transcripts + books
- Powered by embeddings of his entire YouTube archive
- Returns timestamps + source videos
- Why: turns the site into an actual research tool

### 32. Timeline mode
- 3D-scrollable timeline (horizontal scroll) covering 1000+ years of Saurashtra
- Each event is a card with a video link
- Inspired by Google Arts & Culture timelines

### 33. Audio podcast feed
- Auto-generate a podcast RSS from his YouTube videos
- Each episode is the audio track of a video
- Listed in Apple Podcasts, Spotify, etc.

### 34. Book marketplace
- Direct purchase / shipping integration for out-of-print books
- Razorpay + India Post API
- Why: lots of people ask where to buy his books

### 35. Virtual museum / 3D artifact viewer
- For the books that include photographs of artifacts, gates, manuscripts
- Three.js viewer with rotation + zoom
- Metadata overlay on each artifact

---

## 📊 Priority recommendation (if I had to pick 5 to do first)

1. **#3 OG previews** — 2h work, massive impact on WhatsApp sharing
2. **#18 Saurashtra map** — the killer feature, 1 week
3. **#11 PDF reader** — makes the books actually accessible
4. **#2 Newsletter** — builds a direct channel to his audience
5. **#1 On This Day** — adds daily freshness, cheap to ship

---

## 🖼️ Gallery: HD/SD + Watermark model (fleshed out 2026-07-13)

Two-tier image delivery for the Gujarat Column newspaper archive:

### Free tier (default, what everyone sees)
- **Low-resolution preview** (~1000px wide, 75% quality JPEG, ~150–250KB each)
- **Visible watermark** baked in: diagonal repeating "praduman.com" + "PREVIEW" overlay
- Visible in masonry grid + lightbox view
- Cannot download the file (right-click disabled, no download button exposed)
- If user inspects the URL they still get the low-res watermarked version

### Paid tier (membership)
- **Full-resolution original** (2500px+ wide, lossless, ~2–4MB each)
- **No watermark** or invisible forensic watermark
- Download button enabled
- "Original scan" badge on tile
- Direct download from `/api/membership/download?id=g0001&token=...`

### Technical plan

1. **Source separation**:
   - `public/gallery/preview/` — downscaled + watermarked versions (auto-generated at build)
   - `public/gallery/originals/` — HD scans (private, not in public bundle, served via signed URL)

2. **Build-time pipeline** (extend `scripts/gen-gallery.mjs`):
   - For each original: generate a 1000px-wide preview at q=75
   - Apply diagonal watermark using `sharp` (text + opacity 0.3, repeat every 300px)
   - Write to `public/gallery/preview/`
   - `manifest.json` gets both URLs: `previewSrc` (free) + `originalSrc` (gated)

3. **Server-side gate** (`api/membership/download.ts`):
   - Verifies membership via Razorpay subscription ID or session token
   - Generates signed URL valid for 5 minutes
   - Returns 402 if no active membership
   - Logs every download for audit

4. **Auth (deferred, not blocking)**
   - Magic-link email auth (Resend) → JWT in httpOnly cookie
   - Razorpay subscription webhook → upgrades account to "member"
   - `/membership` page: pricing, benefits, manage subscription
   - For now, a mock auth that flips a `pk_member` flag in localStorage so we can develop the UI

5. **Column clipping rule** (per your instruction):
   - Newspaper **clippings** → SD preview + watermark, HD gated
   - Newspaper **full columns** / PDFs (e.g. "રૂપાળું નામ.pdf") → always HD, no watermark, free
   - Reason: columns are owned by the author; clippings are scans of third-party papers and need protection

6. **UI changes needed in Gallery page**:
   - Tile shows preview + small "🔒 HD" badge
   - Lightbox HD button: if member → direct download, if not → upgrade modal
   - Add a member-only "Originals" tab in the toolbar
   - Show member status indicator in nav (subtle crown icon when logged in)

7. **Open questions to decide later with your father**:
   - Pricing tiers (monthly? annual? one-time per clipping?)
   - What exactly is "member" — just HD, or also early access to new videos, etc.?
   - Refund policy
   - Regional pricing (Gujarat readers vs international)

---

## 🐛 Quirks to fix later (parking lot)

Things noticed but not urgent — revisit when you have time to test.

- **Mobile menu overflow** on phones <360px wide — links wrap weirdly
- **Gujarati text rendering** — some Gujarati characters look slightly off in headings; likely a font fallback issue (verify Noto Sans Gujarati loads on all devices)
- **Touch zoom in lightbox** — pinch-to-zoom not wired, only button zoom
- **Search input** in Gallery doesn't actually filter yet (placeholder only, waiting for OCR'd metadata)
- **Book detail TOC** can be very long for some books; needs scroll-to-chapter anchors
- **Hero marquee** — items cut off on narrow viewports
- **Stats page** warning text is jarring; soften the tone
- **Books spine hover state** — the slight slide animation can feel jumpy on slow connections
- **Print stylesheet** for BookDetail — only covers basic; could be more thorough
- **404 page** — currently generic; could have a "back to safety" theme
- **Image lazy loading** — works on Gallery but not yet on BookDetail covers
- **Spine view bookmark icon** sometimes appears on the right edge on tablets
- **Trailing slash redirects** — `/about` vs `/about/` not consistent
- **Service worker / offline** — not implemented, would fix "blank page on flaky network"

---

## 🛣️ CMS for your father (deferred big project)

When you want your father to edit his own content without you in the loop:

### Option A: Supabase (recommended, fastest)
- Supabase Postgres for book metadata, clipping metadata, achievements
- Supabase Auth with magic link (your father's email)
- Supabase Storage for original images / new book scans
- `/admin` route (already exists) → protected by Supabase auth
- UI: simple form to upload new clipping, add book ISBN, update bio
- Cost: free tier covers everything (500MB DB, 1GB storage, 50K auth users)

### Option B: Vercel KV + UploadThing
- Vercel KV (Redis) for key/value content
- UploadThing for file uploads
- Less flexible queries, but simpler

### Option C: Markdown files in repo (current model, slightly upgraded)
- Your father edits `.md` files in a separate Git branch
- Vercel preview deploys for review
- You merge & ship
- Pros: no auth, no DB, version-controlled
- Cons: requires him to learn git/markdown basics, or you to be in the loop

### Recommendation
Start with Option A (Supabase). It's the most professional, scales to anything he wants to add later (events, press mentions, new book releases), and has a great free tier.

### Build estimate
- Auth + protected admin route: 1 day
- CRUD for books, clippings, achievements: 2–3 days
- Image upload + processing: 1 day
- Polish + your father's onboarding: 1 day


---

## 📅 "Next round" parking lot (do not forget, in your words: "keep it in ur mind or roadmap")

Things you explicitly said to handle later, captured so we don't lose them:

- **OCR each gallery image** to extract headlines + topics + dates — feeds search & topic filtering, lets users group by subject. "Sort/filtering/group/views and topics add and nicer metadata based on u viewing each image"
- **Move/filter out low-res images** from the gallery — taming the collection so the best scans surface first
- **Convex CMS** (not Supabase, your call) — for your father to edit his own content
- **Watermark pipeline** (sharp at build time) for the HD/SD two-tier model — but only after you decide the membership tier
- **Read the Aaradhak book** (when you send it in a readable format — phone photos, re-exported CDR, or Adobe searchable-PDF)
- **Book scans** (front/back covers + index/ISBN) — you said "i would give book things or its sample and book front/back & index/isbn" when ready
- **Fix Gujarati text rendering quirks** — investigate font fallback, possibly preload Noto Sans Gujarati
- **Sort/filtering/group/views** in gallery — already started (outlet filter, sort, search), but deeper topic-based grouping is next

---

## 📖 How to give me the book so I can read it

**Best options (in order of effort vs quality):**

1. **Phone photos of each page** — fastest, ~10 min of flipping and snapping
   - Shoot in good light, no shadows, pages flat
   - 115 pages × ~5 sec each = ~10 minutes
   - Send as a zip or upload to Drive and share link
   - I can OCR them with tesseract and read the text

2. **Re-export from the original `.cdr` file in CorelDRAW**
   - Open in CorelDRAW
   - File → Export As → PDF
   - In the PDF settings dialog, make sure:
     - ✅ "Embed all fonts" is checked
     - ❌ "Convert text to paths" is UNCHECKED (this is the key — the original 2013 export had this on, which is why we got the broken encoding)
     - ✅ "Preserve text fidelity" or "Use Unicode"
   - Takes ~2 min
   - Output is a clean Unicode PDF I can read directly with `pymupdf`

3. **Adobe Acrobat Pro "Save as Searchable Image"**
   - Open the current PDF in Acrobat
   - File → Save As Other → Searchable Image (or "Export PDF → Searchable Image")
   - Acrobat OCRs the document and re-creates a real text layer, even over the broken CorelDRAW font
   - Output is a real PDF with searchable Unicode text
   - Takes ~5 min depending on page count

4. **Print + scan to PDF** at 300 DPI
   - Highest fidelity but slowest
   - Use any scanner app (Adobe Scan, Apple Notes, etc.)
   - Output is image-based, I'll OCR it

**My strong recommendation:** Try option 3 first if you have Acrobat Pro (most likely, since you probably have a Creative Cloud subscription for the print design). Adobe's OCR is excellent for Gujarati.

If you don't have Acrobat, option 1 (phone photos) is honestly the easiest — just shoot and send.

**What I will do with the text once I can read it:**
- Draft a comprehensive biography section for `/about` based on the book's content
- Add richer details to the Tribute cards
- Surface interesting anecdotes for the "On This Day" feature (if we build it)
- Show you the draft before it goes live, so you can edit/censor

**What I will NOT do:**
- Publish the book online, even as samples
- Quote large passages (only short attributed excerpts for the bio)
- Share the text file with anyone

