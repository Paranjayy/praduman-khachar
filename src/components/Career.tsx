import { CAREER, EDUCATION } from "../data/content";
import { useReveal } from "../hooks/useAnimations";

interface TimelineItemProps {
  period: string;
  title: string;
  place: string;
  desc?: string;
  index: number;
}

function TimelineItem({ period, title, place, desc, index }: TimelineItemProps) {
  const [ref, visible] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className="career-item"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.6s ${index * 0.1}s ease`,
      }}
    >
      <div className="career-grid">
        <div className="career-year">{period}</div>
        <div className="career-info">
          <h3 className="career-title">{title}</h3>
          <p className="career-desc">
            <em>{place}</em>
            {desc && <><br />{desc}</>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Career() {
  const [ref, visible] = useReveal();
  const [ref2, visible2] = useReveal();

  return (
    <section id="career" className="section">
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
        <p className="section-label">Career</p>
        <h2 className="section-title">Academic Journey</h2>
        <div className="section-divider" />
      </div>

      <div className="about-grid">
        <div>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            marginBottom: "var(--space-lg)",
            color: "var(--c-ink-muted)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontSize: "0.72rem",
          }}>
            Professional Experience
          </h3>
          <div className="career-timeline">
            {CAREER.map((item, i) => (
              <TimelineItem key={i} {...item} index={i} />
            ))}
          </div>
        </div>

        <div>
          <div ref={ref2} className={`reveal${visible2 ? " visible" : ""}`}>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.72rem",
              fontWeight: 600,
              marginBottom: "var(--space-lg)",
              color: "var(--c-ink-muted)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              Education
            </h3>
          </div>
          <div className="career-timeline">
            {EDUCATION.map((item, i) => (
              <TimelineItem
                key={i}
                period={item.year}
                title={item.degree}
                place={item.university}
                desc={item.grade || ""}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
