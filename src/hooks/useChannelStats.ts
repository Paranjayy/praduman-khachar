import { useState, useEffect } from "react";

export interface ChannelStats {
  subscribers: string;
  videoCount: string;
  channelName: string;
  avatarUrl: string | null;
  cached: boolean;
}

const FALLBACK: ChannelStats = {
  subscribers: "42,600+",
  videoCount: "575+",
  channelName: "Praduman Khachar",
  avatarUrl: null,
  cached: true,
};

export function useChannelStats(): { stats: ChannelStats; loading: boolean } {
  const [stats, setStats] = useState<ChannelStats>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/stats.json", { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((data: any) => {
        if (data.videos) {
          setStats(prev => ({ ...prev, videoCount: `${data.videos}+` }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
