// Vercel serverless function — fetches YouTube channel RSS and returns JSON
// No API key required. Uses YouTube's public Atom/RSS feed.
// Channel ID: UCcxf3xuzjb9exyfzdrjdxo (Praduman Khachar)

const CHANNEL_ID = "UCcxf3xuzjb9exyfzdrjdxo";

interface VideoEntry {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  published: string;
  views?: string;
}

function parseXML(xml: string): VideoEntry[] {
  const entries: VideoEntry[] = [];
  // Extract <entry> blocks
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    const idMatch = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const titleMatch = block.match(/<title>(.*?)<\/title>/);
    const publishedMatch = block.match(/<published>(.*?)<\/published>/);
    const viewsMatch = block.match(/<media:statistics views="(\d+)"/);

    if (!idMatch || !titleMatch) continue;
    const videoId = idMatch[1].trim();
    entries.push({
      id: videoId,
      title: titleMatch[1].trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
      thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      published: publishedMatch ? publishedMatch[1].trim() : "",
      views: viewsMatch ? viewsMatch[1] : undefined,
    });
  }
  return entries;
}

export default async function handler(req: Request): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
  };

  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; portfolio-bot/1.0)" },
    });

    if (!res.ok) throw new Error(`YouTube feed returned ${res.status}`);
    const xml = await res.text();
    const videos = parseXML(xml);

    // Also return channel meta from first entry
    const channelNameMatch = xml.match(/<author>\s*<name>(.*?)<\/name>/);
    
    return new Response(
      JSON.stringify({
        videos: videos.slice(0, 15),
        channelId: CHANNEL_ID,
        channelName: channelNameMatch ? channelNameMatch[1] : "Praduman Khachar",
        channelUrl: `https://www.youtube.com/channel/${CHANNEL_ID}`,
        total: videos.length,
      }),
      { status: 200, headers }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch YouTube feed", videos: [] }),
      { status: 500, headers }
    );
  }
}

export const config = { runtime: "edge" };
