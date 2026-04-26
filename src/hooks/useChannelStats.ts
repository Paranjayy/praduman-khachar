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
    fetch("/api/channel", { signal: AbortSignal.timeout(5000) })
      .then((r) => r.json())
      .then((data: ChannelStats) => {
        if (data.subscribers) setStats(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
