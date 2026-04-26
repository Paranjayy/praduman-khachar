import { SITE } from "../data/content";
import { useReveal } from "../hooks/useAnimations";

export default function Contact() {
  const [ref, visible] = useReveal();

  return (
    <section id="contact" className="section">
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
        <p className="section-label">Contact</p>
        <h2 className="section-title">Get in Touch</h2>
        <div className="section-divider" />
      </div>

      <div className="contact-grid">
        <div>
          <div className="contact-info-item">
            <div>
              <strong>Designation</strong>
              {SITE.designation}, {SITE.institution}
            </div>
          </div>
          <div className="contact-info-item">
            <div>
              <strong>Location</strong>
              Junagadh, Gujarat, India
            </div>
          </div>
          <div className="contact-info-item">
            <div>
              <strong>Email</strong>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </div>
          </div>
          <div className="contact-info-item">
            <div>
              <strong>Connect</strong>
              <span style={{ fontSize: "0.9rem", color: "var(--c-ink-soft)" }}>
                Find Dr. Khachar on YouTube, Instagram, Facebook, and other platforms in the Media section above.
              </span>
            </div>
          </div>
        </div>

        <div>
          <blockquote className="contact-quote">
            "History is not merely what happened — it is the act of remembering,
            preserving, and passing forward the stories that shape who we are."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
