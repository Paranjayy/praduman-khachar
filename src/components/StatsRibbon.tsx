import { STATS } from "../data/content";
import { useReveal } from "../hooks/useAnimations";

function StatItem({ number, label, delay }) {
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
  return (
    <div className="stats-ribbon">
      {STATS.map((s, i) => (
        <StatItem key={i} {...s} delay={i * 0.1} />
      ))}
    </div>
  );
}
