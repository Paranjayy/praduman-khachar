// Vercel serverless function — fetches YouTube RSS via rss2json (no API key, CORS-safe)
// Falls back to direct XML parse if rss2json fails.
// Channel ID: UCcxf3xuzjb9exyfzdrjdxo (Praduman Khachar)

const CHANNEL_ID = "UCcxf3xuzjb9exyfzdrjdxo";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

interface VideoEntry {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  published: string;
}

function parseXML(xml: string): VideoEntry[] {
  const entries: VideoEntry[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    const idMatch = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const titleMatch = block.match(/<title>(.*?)<\/title>/);
    const publishedMatch = block.match(/<published>(.*?)<\/published>/);
    if (!idMatch || !titleMatch) continue;
    const videoId = idMatch[1].trim();
    entries.push({
      id: videoId,
      title: titleMatch[1].trim()
        .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'"),
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      published: publishedMatch ? publishedMatch[1].trim() : "",
    });
  }
  return entries;
}

export default async function handler(_req: Request): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600",
  };

  // Try rss2json.com first — reliable CORS proxy for RSS feeds
  try {
    const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=15`;
    const r2jRes = await fetch(rss2jsonUrl, { signal: AbortSignal.timeout(5000) });
    if (r2jRes.ok) {
      const data = await r2jRes.json() as {
        status: string;
        items?: { guid: string; title: string; thumbnail: string; pubDate: string; link: string }[];
      };
      if (data.status === "ok" && data.items?.length) {
        const videos: VideoEntry[] = data.items.map((item) => {
          // extract video ID from link
          const vidMatch = item.link.match(/v=([^&]+)/);
          const videoId = vidMatch ? vidMatch[1] : item.guid.replace("yt:video:", "");
          return {
            id: videoId,
            title: item.title,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            url: item.link,
            published: item.pubDate,
          };
        });
        return new Response(JSON.stringify({ videos, total: videos.length }), { status: 200, headers });
      }
    }
  } catch (_) {
    // rss2json failed, fall through to direct fetch
  }

  // Direct RSS fetch fallback
  try {
    const res = await fetch(RSS_URL, {
      headers: {
        "Accept": "application/atom+xml,application/xml,text/xml",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const xml = await res.text();
    const videos = parseXML(xml);
    return new Response(JSON.stringify({ videos: videos.slice(0, 15), total: videos.length }), { status: 200, headers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return new Response(JSON.stringify({ error: msg, videos: [] }), { status: 500, headers });
  }
}

export const config = { runtime: "edge" };
