/**
 * src/components/FeaturedTalks.tsx
 *
 * "Featured Talks" carousel — pulls top videos from videos.json by likes.
 * Horizontal scroll carousel on mobile, 3-column grid on desktop.
 * Shows top 9 videos. First one gets "hero" treatment.
 */

import { useState, useEffect, useRef } from "react";
import { useReveal } from "../hooks/useAnimations";
import { track } from "@vercel/analytics";

interface VideoItem {
  id: string;
  slug: string;
  title: string;
  thumbnailMq: string;
  thumbnail: string;
  views: string | null;
  likes: string | null;
  readMinutes: number;
  durationSec?: number;
  transcriptWordCount: number;
  publishedAt: string;
  url: string;
}

function parseLikes(s: string | null): number {
  if (!s) return 0;
  return parseInt(s.replace(/[^0-9]/g, "")) || 0;
}

function parseViews(s: string | null): number {
  if (!s) return 0;
  return parseInt(s.replace(/[^0-9]/g, "")) || 0;
}

function fmtNum(s: string | null): string {
  if (!s) return "";
  const n = parseInt(s.replace(/[^0-9]/g, ""));
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return s;
}

function fmtDuration(sec?: number | null): string {
  if (!sec) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function TalkCard({
  v,
  featured = false,
}: {
  v: VideoItem;
  featured?: boolean;
}) {
  const [ref, visible] = useReveal();
  return (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={v.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`featured-talk-card${featured ? " featured-talk-card--hero" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.55s ease",
      }}
      onClick={() => track("featured_talk_click", { videoId: v.id })}
    >
      <div className="featured-talk-thumb">
        <img
          src={v.thumbnailMq}
          alt={v.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = v.thumbnail;
          }}
        />
        <span className="featured-talk-play">▶</span>
        {v.durationSec ? (
          <span className="featured-talk-duration">{fmtDuration(v.durationSec)}</span>
        ) : null}
      </div>
      <div className="featured-talk-info">
        <h3 className="featured-talk-title">{v.title}</h3>
        <div className="featured-talk-stats">
          {v.views && <span>👁 {fmtNum(v.views)}</span>}
          {v.likes && <span>👍 {fmtNum(v.likes)}</span>}
        </div>
      </div>
    </a>
  );
}

export default function FeaturedTalks() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/videos.json")
      .then((r) => r.json())
      .then((data) => {
        const sorted: VideoItem[] = [...(data.videos || [])]
          .sort((a, b) => parseLikes(b.likes) - parseLikes(a.likes))
          .slice(0, 9);
        setVideos(sorted);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  if (!loaded) return null; // Don't show while loading (avoids layout shift)
  if (!videos.length) return null;

  const [hero, ...rest] = videos;

  return (
    <section className="featured-talks section-pad" id="featured-talks">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">Featured Talks</span>
          <h2 className="section-title">Most Celebrated Lectures</h2>
          <p className="section-sub">
            Dr. Khachar's most-watched historical talks — on YouTube, transcribed and searchable.
          </p>
        </div>
        <div className="featured-talks-nav">
          <button
            className="featured-talks-arrow"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            className="featured-talks-arrow"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {/* Desktop: hero + 4-card grid */}
      <div className="featured-talks-desktop">
        <TalkCard v={hero} featured />
        <div className="featured-talks-grid">
          {rest.slice(0, 4).map((v) => <TalkCard key={v.id} v={v} />)}
        </div>
      </div>

      {/* Mobile: horizontal scroll strip */}
      <div className="featured-talks-scroll" ref={scrollRef}>
        {videos.map((v) => (
          <a
            key={v.id}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-talk-scroll-card"
            onClick={() => track("featured_talk_click", { videoId: v.id })}
          >
            <div className="featured-talk-thumb">
              <img src={v.thumbnailMq} alt={v.title} loading="lazy" />
              <span className="featured-talk-play">▶</span>
            </div>
            <div className="featured-talk-info">
              <h3 className="featured-talk-title">{v.title}</h3>
              <div className="featured-talk-stats">
                {v.views && <span>👁 {fmtNum(v.views)}</span>}
                {v.likes && <span>👍 {fmtNum(v.likes)}</span>}
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="featured-talks-footer">
        <a
          href="/articles"
          className="featured-talks-all-btn"
        >
          Explore all 575+ lectures →
        </a>
      </div>
    </section>
  );
}
