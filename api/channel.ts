// Vercel Edge Function: fetches live channel stats from YouTube channel page
// Parses the ytInitialData embedded JSON for subscriber count and video count.
// Cache: 1 hour (stats don't change frequently)

const CHANNEL_HANDLE = "@PradumanKhachar";

interface ChannelStats {
  subscribers: string;
  videoCount: string;
  channelName: string;
  avatarUrl: string | null;
  cached: boolean;
}

export default async function handler(_req: Request): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
  };

  const fallback: ChannelStats = {
    subscribers: "42,600+",
    videoCount: "575+",
    channelName: "Praduman Khachar",
    avatarUrl: null,
    cached: true,
  };

  try {
    const url = `https://www.youtube.com/${CHANNEL_HANDLE}/about`;
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      return new Response(JSON.stringify(fallback), { status: 200, headers });
    }

    const html = await res.text();

    // Extract ytInitialData JSON from the page
    const initDataMatch = html.match(/var ytInitialData\s*=\s*(\{.+?\});\s*<\/script>/s);
    if (!initDataMatch) {
      return new Response(JSON.stringify(fallback), { status: 200, headers });
    }

    // Parse — wrap in try since the JSON can be huge and malformed
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(initDataMatch[1]);
    } catch {
      return new Response(JSON.stringify(fallback), { status: 200, headers });
    }

    // Subscriber count: typically in header.c4TabbedHeaderRenderer.subscriberCountText.simpleText
    const header = (data as { header?: { c4TabbedHeaderRenderer?: {
      subscriberCountText?: { simpleText?: string };
      videosCountText?: { runs?: { text: string }[] };
      title?: string;
      avatar?: { thumbnails?: { url: string }[] };
    } } }).header?.c4TabbedHeaderRenderer;

    const subscribers = header?.subscriberCountText?.simpleText ?? fallback.subscribers;
    const videoRuns = header?.videosCountText?.runs;
    const videoCount = videoRuns?.map((r) => r.text).join("") ?? fallback.videoCount;
    const channelName = header?.title ?? fallback.channelName;
    const avatarUrl = header?.avatar?.thumbnails?.[0]?.url ?? null;

    const stats: ChannelStats = {
      subscribers,
      videoCount,
      channelName,
      avatarUrl,
      cached: false,
    };

    return new Response(JSON.stringify(stats), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify(fallback), { status: 200, headers });
  }
}

export const config = { runtime: "edge" };
