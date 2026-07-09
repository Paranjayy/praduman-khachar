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
import { motion } from "framer-motion";

function SplitTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span aria-label={text} className="split-title notranslate" translate="no">
      {words.map((word, wi) => (
        <span key={wi} className="split-word" style={{ whiteSpace: 'nowrap' }}>
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              className="split-char"
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.5 + (wi * 4 + ci) * 0.05,
                ease: [0.16, 1, 0.3, 1]
              }}
              aria-hidden="true"
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && (
            <span className="split-char split-space" aria-hidden="true"> </span>
          )}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    setTimeout(() => el.classList.add("label-revealed"), 300);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-bg-gradient" />
      </div>

      <div className="hero-text">
        <p ref={labelRef} className="hero-label hero-label-anim">
          <span className="hl-word">Historian</span>
          <span className="hl-sep"> · </span>
          <span className="hl-word">Author</span>
          <span className="hl-sep"> · </span>
          <span className="hl-word">Professor</span>
          <span className="hl-sep"> · </span>
          <span className="hl-word">YouTuber</span>
        </p>
        <h1 className="hero-title notranslate" translate="no">
          <SplitTitle text={SITE.title} />
        </h1>
        <p className="hero-subtitle">{SITE.tagline}</p>
      </div>

      <div className="hero-portrait">
        <img
          src="/profile.png"
          alt={SITE.name}
          className="hero-main-portrait"
        />
      </div>

      <div className="hero-marquee">
        <Marquee items={MARQUEE_ITEMS} speed={55} separator="·" />
      </div>
    </section>
  );
}
