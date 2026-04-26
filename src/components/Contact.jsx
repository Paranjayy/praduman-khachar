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
              <strong>Work Address</strong>
              Bilkha Road, Manoranjan Campus, Junagadh – 362001
            </div>
          </div>
          <div className="contact-info-item">
            <div>
              <strong>Residence</strong>
              "SHIV SHAKTI", Valani Nagar, Plot No. 14,<br />
              Street No. 2, Junagadh – 362002
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
              <strong>Phone</strong>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
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
