import { useState, useEffect } from "react";

export interface ChannelStats {
  subscribers: string;
  videoCount: string;
  totalDurationHours: string;
  channelName: string;
  avatarUrl: string | null;
  cached: boolean;
}

const FALLBACK: ChannelStats = {
  subscribers: "42,600+",
  videoCount: "575+",
  totalDurationHours: "350+",
  channelName: "Praduman Khachar",
  avatarUrl: null,
  cached: true,
};

export function useChannelStats(): { stats: ChannelStats; loading: boolean } {
  const [stats, setStats] = useState<ChannelStats>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/videos.json", { signal: AbortSignal.timeout(5000) })
      .then((r) => r.json())
      .then((data: any) => {
        const videos = data.videos || [];
        if (videos.length > 0) {
          const totalSecs = videos.reduce((acc: number, v: any) => acc + (v.durationSeconds || 0), 0);
          const hours = Math.floor(totalSecs / 3600);
          setStats({
            ...FALLBACK,
            videoCount: videos.length.toString(),
            totalDurationHours: hours.toLocaleString(),
            cached: false
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
