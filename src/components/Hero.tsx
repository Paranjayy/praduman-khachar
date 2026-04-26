import { SITE } from "../data/content";

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
        <img
          src="/portrait.png"
          alt={`Portrait of ${SITE.name}`}
        />
      </div>
    </section>
  );
}
