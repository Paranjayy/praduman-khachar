# Dr. Praduman Khachar — Portfolio Website

**Live:** https://praduman-khachar.vercel.app  
**Repo:** https://github.com/Paranjayy/praduman-khachar

A professional digital portfolio for Dr. Pradumankumar B. Khachar — Historian, Author, Associate Professor, and YouTuber from Junagadh, Gujarat.

---

## 🏗 Tech Stack

- **Framework:** React + TypeScript + Vite
- **Styling:** Vanilla CSS (Stripe-Press aesthetic — serif, parchment tones, scholarly)
- **Routing:** react-router-dom v6
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel (auto-deploy on push to `main`)
- **Fonts:** Playfair Display · Source Serif 4 · Noto Sans Gujarati

---

## 📁 Structure

```
src/
  App.tsx            — routes
  index.css          — all styles (~1600 lines)
  data/
    content.ts       — books, playlists, stats, socials
    writings.ts      — Dr. K's own articles (add here)
  pages/
    Home.tsx         — landing
    About.tsx        — biography, career, achievements
    Books.tsx        — 33 books with category filter
    Media.tsx        — 575 videos + playlists tabs
    Articles.tsx     — video transcript reader (deep-linked)
    Writings.tsx     — original scholarly writing
    Admin.tsx        — password-protected writing studio
  components/        — Hero, Nav, Footer, etc.
public/
  data/
    videos.json      — 575 scraped videos (DO NOT edit manually)
    playlists.json   — playlist metadata
scripts/
  scrape-channel.mjs — yt-dlp full channel scraper
```

---

## 🎥 Video Archive

All 575 videos scraped via `yt-dlp`:
- 506 regular videos
- 66 YouTube Shorts
- 3 live streams

Each video includes: title, description, thumbnail, views, likes, comments, VTT transcript (Gujarati/Hindi priority), tags, publish date.

```bash
export PATH="/opt/homebrew/bin:$PATH"

# Resume scrape (skips already-done):
node scripts/scrape-channel.mjs

# Fresh scrape:
node scripts/scrape-channel.mjs --fresh

# After scrape — deploy data:
git add public/data && git commit -m "data: update archive" && git push
```

---

## ✍️ Adding Articles (for Dr. Khachar)

1. Go to `/admin` on the live site
2. Enter password: `history2024`
3. Write your article using the editor
4. Click "Export TypeScript"
5. Paste the copied code into `src/data/writings.ts` inside the `WRITINGS` array
6. Commit and push — Vercel deploys in ~30 seconds

---

## 🚀 Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

---

## 📊 Stats (as of April 2026)

| Metric | Value |
|---|---|
| Books published | 33 |
| Selected by Library of Congress, USA | 23 |
| Videos archived | 575 |
| Years teaching | 33+ |
| PhD students guided | 4 completed, 3 in progress |

---

## 🗺 Roadmap

See [DELEGATE.md](https://github.com/Paranjayy/praduman-khachar) in this repo for the full task list and design plans.

Key upcoming features:
- [ ] Contact form (Formspree)
- [ ] Featured Talks carousel (top videos by likes)
- [ ] Hero redesign (cinematic, parallax, animated counter)
- [ ] 3D book grid (needs book cover photos)
- [ ] Interactive career timeline
- [ ] Abhilekh Patal browser extension
- [ ] Unified search across videos + writings + books
