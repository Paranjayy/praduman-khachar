import { useState } from "react";
import { useScrolled } from "../hooks/useAnimations";
import { SITE } from "../data/content";

export default function Nav() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);

  const links = [
    ["About", "#about"],
    ["Achievements", "#achievements"],
    ["Career", "#career"],
    ["Publications", "#publications"],
    ["Media", "#media"],
    ["Contact", "#contact"],
  ];

  return (
    <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <a href="#" className="nav-brand">{SITE.name}</a>
      <ul className={`nav-links${open ? " open" : ""}`}>
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href} onClick={() => setOpen(false)}>{label}</a>
          </li>
        ))}
      </ul>
      <button
        className="nav-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
