import Marquee from "./Marquee";
import { SITE } from "../data/content";

// Book titles for marquee — keeps it contextual and Gujarati-flavoured
const MARQUEE_ITEMS = [
  "Junagadh State History",
  "Kathi Darbars of Saurashtra",
  "India's Freedom Struggle",
  "Girnar — Sacred Mountain",
  "Bhavnagar Royal Archives",
  "Gujarat Folk Art",
  "Library of Congress, USA",
  "575+ Historical Videos",
  "42,000+ Subscribers",
  "33 Published Books",
  "Gohel Dynasty Chronicles",
  "History of Porbandar",
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="/junagadh.png" alt="Girnar mountain range, Junagadh" />
      </div>

      <div className="hero-text">
        <p className="hero-label">Historian · Author · Researcher</p>
        <h1 className="hero-title">{SITE.title}</h1>
        <p className="hero-subtitle">{SITE.tagline}</p>
      </div>

      <div className="hero-portrait">
        <img src="/portrait.png" alt={`Portrait of ${SITE.name}`} />
      </div>

      {/* Marquee ticker at the bottom of the hero */}
      <div className="hero-marquee">
        <Marquee items={MARQUEE_ITEMS} speed={55} separator="·" />
      </div>
    </section>
  );
}
