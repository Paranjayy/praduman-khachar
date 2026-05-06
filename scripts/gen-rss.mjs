import fs from 'fs';
import path from 'path';

const VIDEOS_PATH = path.join(process.cwd(), 'public', 'data', 'videos.json');
const RSS_PATH = path.join(process.cwd(), 'public', 'rss.xml');

function escapeXml(unsafe) {
  return (unsafe || '').replace(/[<>&"']/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
    }
  });
}

function generateRss() {
  if (!fs.existsSync(VIDEOS_PATH)) {
    console.error('videos.json not found');
    return;
  }

  const data = JSON.parse(fs.readFileSync(VIDEOS_PATH, 'utf-8'));
  const videos = data.videos || [];

  const items = videos.slice(0, 50).map(v => `
    <item>
      <title>${escapeXml(v.title)}</title>
      <link>${v.url}</link>
      <guid>${v.id}</guid>
      <pubDate>${new Date(v.publishedAt || Date.now()).toUTCString()}</pubDate>
      <description>${escapeXml(v.description || '')}</description>
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Dr. Praduman Khachar Archival Workstation</title>
  <link>https://praduman-khachar.vercel.app</link>
  <description>Historical narratives and archival records of Saurashtra, narrated by Dr. Praduman Khachar.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${items}
</channel>
</rss>`;

  fs.writeFileSync(RSS_PATH, rss);
  console.log('✅ rss.xml generated at public/rss.xml');
}

generateRss();
