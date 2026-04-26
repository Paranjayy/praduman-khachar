import { ACHIEVEMENTS } from "../data/content";
import { useReveal } from "../hooks/useAnimations";

function AchievementItem({ icon, text, index }) {
  const [ref, visible] = useReveal(0.1);
  const parts = text.split(/\*\*(.*?)\*\*/g);

  return (
    <li
      ref={ref}
      className="achievement-item"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-12px)",
        transition: `all 0.5s ${index * 0.07}s ease`,
      }}
    >
      <span className="achievement-icon">{icon}</span>
      <span className="achievement-text">
        {parts.map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        )}
      </span>
    </li>
  );
}

export default function Achievements() {
  const [ref, visible] = useReveal();

  return (
    <section id="achievements" className="section">
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
        <p className="section-label">Recognition</p>
        <h2 className="section-title">Awards &amp; Achievements</h2>
        <div className="section-divider" />
      </div>

      <ul className="achievements-list">
        {ACHIEVEMENTS.map((a, i) => (
          <AchievementItem key={i} {...a} index={i} />
        ))}
      </ul>
    </section>
  );
}
