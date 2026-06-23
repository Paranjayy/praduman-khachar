import { useState, useEffect } from "react";
import { STATS } from "../data/content";
import { useReveal } from "../hooks/useAnimations";
import AnimatedCounter from "./AnimatedCounter";

interface StatItem {
  number: string | number;
  label: string;
}

/** Parse "485+" → { value: 485, suffix: "+" }; "1.2K" → { value: 1.2, suffix: "K" }; 33 → { value: 33, suffix: "" } */
function parseStatNumber(raw: string | number): { value: number; suffix: string } {
  const str = String(raw).trim();
  const match = str.match(/^([\d.]+)([^0-9.]*)$/);
  if (match) {
    return { value: parseFloat(match[1]), suffix: match[2] || "" };
  }
  const num = parseFloat(str);
  return { value: isNaN(num) ? 0 : num, suffix: "" };
}

interface StatCardProps {
  item: StatItem;
  delay: number;
}

function StatCard({ item, delay }: StatCardProps) {
  const [ref, visible] = useReveal(0.3);
  const { value, suffix } = parseStatNumber(item.number);
  const isDecimal = value !== Math.floor(value);

  return (
    <div
      ref={ref}
      className="stat-item"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.6s ${delay}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="stat-number">
        {visible ? (
          <AnimatedCounter
            target={isDecimal ? Math.round(value * 10) : Math.round(value)}
            suffix={isDecimal ? suffix : suffix}
            duration={1600}
            decimal={isDecimal ? 1 : 0}
          />
        ) : (
          <span>0</span>
        )}
      </div>
      <div className="stat-label">{item.label}</div>
    </div>
  );
}

export default function StatsRibbon() {
  const [liveStats, setLiveStats] = useState<any>(null);

  useEffect(() => {
    fetch('/data/stats.json')
      .then(r => r.json())
      .then(data => setLiveStats(data))
      .catch(() => {});
  }, []);

  const items: StatItem[] = liveStats ? [
    { number: liveStats.videos, label: "Videos Archived" },
    { number: liveStats.totalDurationHours, label: "Hours of History" },
    { number: ((liveStats.youtube?.views || 0) / 1000).toFixed(1) + 'K', label: "Total Reach" },
    { number: liveStats.transcripts, label: "Transcripts Indexed" },
  ] : STATS;

  return (
    <div className="stats-ribbon">
      {items.map((s, i) => (
        <StatCard key={i} item={s} delay={i * 0.12} />
      ))}
    </div>
  );
}
