import { useEffect, useRef } from "react";
import Marquee from "./Marquee";
import { SITE } from "../data/content";

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

// Split title into words, then chars — Lando-style character animation
function SplitTitle({ text }: { text: string }) {
  return (
    <span aria-label={text} className="split-title">
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="split-word">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="split-char"
              style={{ animationDelay: `${0.5 + (wi * 4 + ci) * 0.035}s` }}
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
          {wi < text.split(" ").length - 1 && (
            <span className="split-char split-space" aria-hidden="true"> </span>
          )}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const labelRef = useRef<HTMLParagraphElement>(null);

  // Staggered highlight reveal on the label words (Lando-style)
  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    setTimeout(() => el.classList.add("label-revealed"), 300);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="/junagadh.png" alt="Girnar mountain range, Junagadh" />
      </div>

      <div className="hero-text">
        <p ref={labelRef} className="hero-label hero-label-anim">
          <span className="hl-word">Historian</span>
          <span className="hl-sep"> · </span>
          <span className="hl-word">Author</span>
          <span className="hl-sep"> · </span>
          <span className="hl-word">Researcher</span>
          <span className="hl-sep"> · </span>
          <span className="hl-word hl-word--yt">YouTuber</span>
        </p>
        <h1 className="hero-title">
          <SplitTitle text={SITE.title} />
        </h1>
        <p className="hero-subtitle">{SITE.tagline}</p>
      </div>

      <div className="hero-portrait">
        <img src="/portrait.png" alt={`Portrait of ${SITE.name}`} />
      </div>

      <div className="hero-marquee">
        <Marquee items={MARQUEE_ITEMS} speed={55} separator="·" />
      </div>
    </section>
  );
}
