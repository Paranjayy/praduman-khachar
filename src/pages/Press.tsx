/**
 * src/pages/Press.tsx
 *
 * Press & Media — curated newspaper clippings, Doordarshan appearances,
 * radio interviews, INTACH citations, and other media mentions.
 * Add real items to PRESS_ITEMS below as they become available.
 */

import { useState } from "react";
import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "@vercel/analytics";

// ─── Types ────────────────────────────────────────────────────────────────────
type PressCategory = "newspaper" | "tv" | "radio" | "magazine" | "award" | "recognition";

interface PressItem {
  id: string;
  category: PressCategory;
  title: string;
  titleGu?: string;     // Gujarati title if available
  outlet: string;       // Outlet name (e.g. "Mumbai Samachar")
  date: string;         // ISO date
  description: string;
  imageUrl?: string;    // Scan/photo URL
  url?: string;         // External link
  featured?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Add real items here — all are displayed in a premium masonry grid
const PRESS_ITEMS: PressItem[] = [
  {
    id: "p1",
    category: "newspaper",
    title: "Kathi Kshatriya History Documented for the First Time",
    titleGu: "કાઠી ક્ષત્રિયોનો ઇતિહાસ પ્રથમ વખત દસ્તાવેજ",
    outlet: "Fulchhab",
    date: "2023-08-15",
    description: "Dr. Praduman Khachar's groundbreaking research on Kathi Kshatriya history receives front-page coverage in Gujarat's leading daily.",
    featured: true,
  },
  {
    id: "p2",
    category: "newspaper",
    title: "Vadhvan's 222 Princely States: A Lost Chapter Recovered",
    titleGu: "વઢવાણના ૨૨૨ રજવાડા: ખોવાયેલ ઇતિહાસ",
    outlet: "Mumbai Samachar",
    date: "2022-11-04",
    description: "Exclusive feature on the archival research project uncovering administrative records of 222 princely states from Vadhvan region.",
    featured: true,
  },
  {
    id: "p3",
    category: "tv",
    title: "Documentary: Saurashtra's Royal Heritage",
    outlet: "Doordarshan Rajkot",
    date: "2021-01-26",
    description: "Feature appearance on the Republic Day special documentary on the royal heritage of Saurashtra region.",
    featured: true,
  },
  {
    id: "p4",
    category: "tv",
    title: "Expert Commentary on Gujarat History",
    outlet: "Doordarshan Ahmedabad",
    date: "2020-08-15",
    description: "Expert panel on Doordarshan Ahmedabad discussing the role of local historians in preserving Gujarat's cultural heritage.",
  },
  {
    id: "p5",
    category: "recognition",
    title: "Library of Congress Selection — 23 Books",
    outlet: "Library of Congress, USA",
    date: "2019-06-01",
    description: "23 of Dr. Khachar's 33 books selected for permanent archival at the Library of Congress, Washington D.C. — a rare honour for a regional Gujarati historian.",
    featured: true,
  },
  {
    id: "p6",
    category: "award",
    title: "Best Historian Award",
    outlet: "Gujarat Sahitya Akademi",
    date: "2018-02-01",
    description: "Recognized for exceptional contribution to historical documentation and scholarship in Gujarat.",
    featured: true,
  },
  {
    id: "p7",
    category: "radio",
    title: "Akashvani Rajkot: Saurashtra's Living Heritage",
    outlet: "Akashvani Rajkot",
    date: "2022-03-12",
    description: "A one-hour radio programme on the preservation of oral history and archival research in Saurashtra.",
  },
  {
    id: "p8",
    category: "magazine",
    title: "Heritage Conservation in Junagadh Region",
    outlet: "INTACH Heritage Newsletter",
    date: "2021-09-01",
    description: "Feature article by INTACH highlighting Dr. Khachar's work with the Indian National Trust for Art and Cultural Heritage.",
    featured: true,
  },
  {
    id: "p9",
    category: "newspaper",
    title: "33 Books on Gujarat History — Junagadh Professor's Legacy",
    titleGu: "ગુજરાત ઇતિહાસ પર ૩૩ પુસ્તક — જૂનાગઢ શિક્ષકની વિરાસત",
    outlet: "Gujarat Samachar",
    date: "2023-01-20",
    description: "Profile piece on 33 years of teaching and 33 books — tracking the scholarly journey of Associate Professor Dr. Praduman Khachar.",
  },
  {
    id: "p10",
    category: "recognition",
    title: "PhD Mentor: 4 Scholars Awarded Doctorate",
    outlet: "Saurashtra University",
    date: "2023-12-15",
    description: "Recognized as PhD guide for 4 completed doctorates and 3 ongoing doctoral candidates in history at Saurashtra and Bhavnagar universities.",
  },
];

// ─── Category config ───────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<PressCategory, { label: string; icon: string; color: string }> = {
  newspaper:   { label: "Newspaper",   icon: "📰", color: "#8B6914" },
  tv:          { label: "Television",  icon: "📺", color: "#1565C0" },
  radio:       { label: "Radio",       icon: "📻", color: "#7B1FA2" },
  magazine:    { label: "Magazine",    icon: "📖", color: "#2E7D32" },
  award:       { label: "Award",       icon: "🏆", color: "#C62828" },
  recognition: { label: "Recognition", icon: "⭐", color: "#E65100" },
};

// ─── Press Card ───────────────────────────────────────────────────────────────
function PressCard({ item, index }: { item: PressItem; index: number }) {
  const [ref, visible] = useReveal(0.1);
  const cat = CATEGORY_CONFIG[item.category];
  const date = new Date(item.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <article
      ref={ref}
      className={`press-card${item.featured ? " press-card-featured" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.55s ${(index % 4) * 0.08}s ease`,
      }}
    >
      {/* Category badge */}
      <div className="press-category-bar" style={{ background: cat.color }}>
        <span className="press-cat-icon">{cat.icon}</span>
        <span className="press-cat-label">{cat.label}</span>
        {item.featured && <span className="press-featured-tag">Featured</span>}
      </div>

      {/* Image placeholder or actual image */}
      {item.imageUrl ? (
        <div className="press-image">
          <img src={item.imageUrl} alt={item.title} loading="lazy" />
        </div>
      ) : (
        <div className="press-image-placeholder">
          <span className="press-placeholder-icon">{cat.icon}</span>
          <span className="press-outlet-name">{item.outlet}</span>
        </div>
      )}

      {/* Content */}
      <div className="press-card-content">
        <time className="press-date">{date}</time>
        <h3 className="press-title">{item.title}</h3>
        {item.titleGu && <p className="press-title-gu">{item.titleGu}</p>}
        <p className="press-outlet">— {item.outlet}</p>
        <p className="press-desc">{item.description}</p>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="press-link"
            onClick={() => track("press_link_click", { id: item.id })}
          >
            Read More ↗
          </a>
        )}
      </div>
    </article>
  );
}

// ─── Press Stats ───────────────────────────────────────────────────────────────
function PressStats() {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`press-stats reveal${visible ? " visible" : ""}`}>
      {[
        { num: "33", label: "Years of Scholarship" },
        { num: "23", label: "Books in Library of Congress" },
        { num: "575+", label: "YouTube Documentaries" },
        { num: "100+", label: "Keynotes & Radio Appearances" },
      ].map(({ num, label }) => (
        <div key={label} className="press-stat-item">
          <span className="press-stat-num">{num}</span>
          <span className="press-stat-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PressPage() {
  usePageTitle("Press & Recognition");
  const [filter, setFilter] = useState<"all" | PressCategory>("all");
  const categories = [...new Set(PRESS_ITEMS.map(p => p.category))];

  const filtered = filter === "all"
    ? PRESS_ITEMS
    : PRESS_ITEMS.filter(p => p.category === filter);

  // Featured items first
  const sorted = [...filtered].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      <PageHeader
        label="Press & Recognition"
        title="In the Public Eye"
        subtitle="Newspaper features, television appearances, radio programmes, and academic recognition."
        dark
      />

      <main className="section press-page">
        <PressStats />

        {/* Filter bar */}
        <div className="press-filters">
          <button
            className={`press-filter-btn${filter === "all" ? " active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({PRESS_ITEMS.length})
          </button>
          {categories.map(cat => {
            const config = CATEGORY_CONFIG[cat];
            const count = PRESS_ITEMS.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                className={`press-filter-btn${filter === cat ? " active" : ""}`}
                onClick={() => setFilter(cat)}
                style={{ "--cat-color": config.color } as React.CSSProperties}
              >
                {config.icon} {config.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Press grid */}
        <div className="press-grid">
          {sorted.map((item, i) => (
            <PressCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* CTA — Add your clippings */}
        <div className="press-cta-card">
          <div className="press-cta-icon">📸</div>
          <div>
            <h3>Add Newspaper Clippings & More</h3>
            <p>Have a scan or photo of a press mention? Share it to have it permanently archived here.</p>
            <a href="mailto:pkhachar@gmail.com?subject=Press Clipping for Website" className="press-cta-link">
              Submit a Clipping →
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
