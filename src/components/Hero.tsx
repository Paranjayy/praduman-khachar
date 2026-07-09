import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Marquee from "./Marquee";
import { VisitCounter } from "./VisitCounter";
import { recordEvent } from "../hooks/useAnalytics";
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
  const [liveNow, setLiveNow] = useState(0);

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    setTimeout(() => el.classList.add("label-revealed"), 300);

    // Simulate "live now" — a small real-time count that ticks
    // based on localStorage events from all tabs + a baseline
    const compute = () => {
      try {
        const state = JSON.parse(localStorage.getItem("pk_analytics_v1") || "{}");
        const recent = (state.events || []).filter(
          (e: any) => Date.now() - e.ts < 5 * 60 * 1000,
        );
        // 1-7 based on recent activity, with a small floor
        const base = Math.max(1, Math.min(7, Math.floor(recent.length / 8) + 1));
        setLiveNow(base);
      } catch {
        setLiveNow(1);
      }
    };
    compute();
    const id = setInterval(compute, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg">
        {/* Removed background image as requested */}
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

        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            alignItems: "center",
            marginTop: "1.2rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => {
              navigator.clipboard.writeText("https://www.praduman.com");
              recordEvent("share_copy", "hero_button");
              const btn = document.getElementById("share-btn-text");
              if (btn) {
                const orig = btn.textContent;
                btn.textContent = "✓ Copied!";
                setTimeout(() => {
                  if (btn) btn.textContent = orig;
                }, 1500);
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              background: "var(--c-terracotta)",
              color: "white",
              border: "none",
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--c-terracotta-light)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--c-terracotta)";
            }}
            title="Copy portfolio link to share"
          >
            <span>🔗</span>
            <span id="share-btn-text">Copy Site Link</span>
          </button>
          <a
            href="https://wa.me/?text=Check%20out%20Dr.%20Praduman%20Khachar%27s%20portfolio%20%E2%80%94%20Historian%2C%20Author%2C%20Researcher.%20https%3A%2F%2Fwww.praduman.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => recordEvent("share_whatsapp", "hero_button")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              background: "#25D366",
              color: "white",
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
            title="Share on WhatsApp"
          >
            <span>💬</span>
            <span>Share on WhatsApp</span>
          </a>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            alignItems: "center",
            marginTop: "1.5rem",
            flexWrap: "wrap",
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            color: "var(--c-ink-muted)",
          }}
        >
          <Link
            to="/stats"
            onClick={() => recordEvent("live_pill_click", "hero")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 999,
              background: "color-mix(in oklch, #22c55e 15%, transparent)",
              border: "1px solid color-mix(in oklch, #22c55e 35%, transparent)",
              color: "#16a34a",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            title="View live stats dashboard"
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
                animation: "livepulse 2s infinite",
              }}
            />
            <span style={{ color: "#16a34a" }}>{liveNow} exploring now</span>
          </Link>
          <VisitCounter />
        </div>
        <style>{`@keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }`}</style>
      </div>

      <div className="hero-portrait">
        {/* Only keep the father's photo, remove carousel */}
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
