import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "stats", label: "Impact" },
  { id: "today", label: "Archive Daily" },
  { id: "talks", label: "Featured" },
  { id: "about", label: "About" },
  { id: "achievements", label: "Honors" },
  { id: "career", label: "Journey" },
  { id: "media", label: "Media" },
  { id: "contact", label: "Contact" },
];

export default function HomeTOC() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="home-toc">
      <div className="home-toc-rail">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`home-toc-item ${active === s.id ? "active" : ""}`}
            onClick={() => scrollTo(s.id)}
          >
            <span className="home-toc-dot" />
            <span className="home-toc-label">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
