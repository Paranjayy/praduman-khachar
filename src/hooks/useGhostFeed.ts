import { useState, useEffect } from 'react';

export interface GhostItem {
  id: string;
  shortcode: string;
  type: 'image' | 'video' | 'carousel';
  thumbnail: string;
  url: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: number;
}

export function useGhostFeed() {
  const [feed, setFeed] = useState<GhostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/feed.json')
      .then(res => res.json())
      .then(data => {
        setFeed(data.instagram || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { feed, loading };
}
