import { useState, useEffect } from "react";
import { STATS } from "../data/content";
import { useReveal } from "../hooks/useAnimations";

interface StatItemProps {
  number: string | number;
  label: string;
  delay: number;
}

function StatItem({ number, label, delay }: StatItemProps) {
  const [ref, visible] = useReveal(0.3);
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
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
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

  const items = liveStats ? [
    { number: liveStats.videos, label: "Videos Archived" },
    { number: liveStats.totalDurationHours, label: "Hours of History" },
    { number: (liveStats.youtube.views / 1000).toFixed(1) + 'K', label: "Total Reach" },
    { number: liveStats.transcripts, label: "Transcripts OK" }
  ] : STATS;

  return (
    <div className="stats-ribbon">
      {items.map((s, i) => (
        <StatItem key={i} number={s.number} label={s.label} delay={i * 0.1} />
      ))}
    </div>
  );
}
