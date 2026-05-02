import fs from 'fs';
import path from 'path';

const VIDEOS_PATH = path.join(process.cwd(), 'public/data/videos.json');
const RSS_PATH = path.join(process.cwd(), 'public/rss.xml');
const SITE_URL = 'https://praduman-khachar.vercel.app';

async function generateRSS() {
  try {
    const data = JSON.parse(fs.readFileSync(VIDEOS_PATH, 'utf-8'));
    const videos = data.videos || [];
    
    // Sort by date descending
    videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Take latest 50
    const latest = videos.slice(0, 50);
    
    const items = latest.map(v => `
    <item>
      <title><![CDATA[${v.title}]]></title>
      <link>${SITE_URL}/articles/${v.slug || v.id}</link>
      <guid isPermaLink="false">${v.id}</guid>
      <pubDate>${new Date(v.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[Historical talk by Dr. Praduman Khachar. ${v.views || ''} views.]]></description>
      ${v.thumbnail ? `<media:thumbnail url="${v.thumbnail}" />` : ''}
    </item>`).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>Dr. Praduman Khachar — Archive</title>
  <link>${SITE_URL}</link>
  <description>Historical research, books, and lectures by Dr. Praduman Khachar.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${items}
</channel>
</rss>`;

    fs.writeFileSync(RSS_PATH, rss);
    console.log('✅ RSS Feed generated at public/rss.xml');
  } catch (err) {
    console.error('❌ Failed to generate RSS:', err);
  }
}

generateRSS();
