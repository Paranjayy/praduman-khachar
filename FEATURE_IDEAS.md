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
