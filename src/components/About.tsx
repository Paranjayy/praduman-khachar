import { useReveal } from "../hooks/useAnimations";
import { SITE } from "../data/content";

export default function About() {
  const [ref, visible] = useReveal();

  return (
    <section id="about" className="section">
      <div
        ref={ref}
        className={`reveal${visible ? " visible" : ""}`}
      >
        <p className="section-label">About</p>
        <h2 className="section-title">
          A Lifetime Dedicated<br />to Preserving History
        </h2>
        <div className="section-divider" />
      </div>

      <div className="about-grid">
        <div className="about-text">
          <p>
            Dr. Pradumankumar B. Khachar is one of Saurashtra's most celebrated
            historians — a prolific author of 33 books, a renowned orator, and
            a dedicated academic whose work has earned recognition from the
            Library of Congress in America to the courts of Gujarat.
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
            575+ educational videos to YouTube, appearing on All India Radio
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

        <div className="about-image-block">
          <img src="/books.png" alt="Historical manuscripts and scholarly works" />
          <div className="about-image-caption">
            Scholarly manuscripts &amp; research
          </div>
        </div>
      </div>
    </section>
  );
}
