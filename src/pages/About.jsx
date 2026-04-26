import { SITE, EDUCATION, CAREER, ACHIEVEMENTS, BOOKS } from "../data/content";
import { useReveal } from "../hooks/useAnimations";

export default function AboutPage() {
  const [ref, visible] = useReveal();

  return (
    <main className="page-content">
      <section className="section" style={{ paddingTop: "8rem" }}>
        <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
          <p className="section-label">About</p>
          <h1 className="section-title">
            Dr. Pradumankumar B. Khachar
          </h1>
          <div className="section-divider" />
        </div>

        <div className="about-page-grid">
          <div className="about-page-main">
            <p className="about-lead">
              One of Saurashtra's most celebrated historians — a prolific author
              of 33 books, a renowned orator, and a dedicated academic whose work
              has earned recognition from the Library of Congress in America to the
              courts of Gujarat.
            </p>
            <p>
              Based in Junagadh, at the foothills of the sacred Girnar mountain,
              Dr. Khachar has spent over three decades at {SITE.institution},
              combining rigorous scholarship with passionate storytelling.
              His historical exhibitions across Gujarat have brought forgotten
              chapters of regional heritage to life for thousands.
            </p>
            <p>
              Beyond the written word, he has embraced modern media — uploading
              485+ educational videos to YouTube, appearing on All India Radio
              and Doordarshan, and contributing as a columnist to Mumbai Samachar
              and Fulchhab. He serves as Convener of INTACH's Junagadh chapter,
              safeguarding the region's architectural and cultural legacy.
            </p>
            <p>
              As a PhD guide, he continues to mentor the next generation of
              historians, while his books — cited in 11 court cases — stand as
              authoritative references on the history of Gujarat.
            </p>
          </div>

          <div className="about-page-sidebar">
            <div className="about-sidebar-card">
              <h3>Quick Facts</h3>
              <dl className="about-facts">
                <dt>Designation</dt>
                <dd>{SITE.designation}</dd>
                <dt>Institution</dt>
                <dd>{SITE.institution}</dd>
                <dt>Location</dt>
                <dd>{SITE.location}</dd>
                <dt>Books</dt>
                <dd>{BOOKS.length} published</dd>
                <dt>Teaching</dt>
                <dd>33+ years</dd>
                <dt>PhD Scholars</dt>
                <dd>4 completed, 3 in progress</dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="section">
        <h2 className="section-title">Education</h2>
        <div className="section-divider" />
        <div className="education-cards">
          {EDUCATION.map((edu, i) => (
            <EduCard key={i} {...edu} index={i} />
          ))}
        </div>
      </section>

      {/* Career Timeline */}
      <section className="section">
        <h2 className="section-title">Career Timeline</h2>
        <div className="section-divider" />
        <div className="timeline">
          {CAREER.map((item, i) => (
            <TimelineItem key={i} {...item} index={i} />
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="section">
        <h2 className="section-title">Awards &amp; Recognition</h2>
        <div className="section-divider" />
        <ul className="achievements-list">
          {ACHIEVEMENTS.map((a, i) => (
            <AchievementItem key={i} {...a} index={i} />
          ))}
        </ul>
      </section>
    </main>
  );
}

function EduCard({ degree, university, year, grade, index }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="edu-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.5s ${index * 0.1}s ease`,
      }}
    >
      <div className="edu-year">{year}</div>
      <h3 className="edu-degree">{degree}</h3>
      <p className="edu-uni">{university}</p>
      {grade && <p className="edu-grade">{grade}</p>}
    </div>
  );
}

function TimelineItem({ period, title, place, desc, index }) {
  const [ref, visible] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className="timeline-item"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.6s ${index * 0.1}s ease`,
      }}
    >
      <div className="timeline-year">{period}</div>
      <h3 className="timeline-title">{title}</h3>
      <p className="timeline-desc">
        <em>{place}</em>
        {desc && <><br />{desc}</>}
      </p>
    </div>
  );
}

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
