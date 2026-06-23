import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { BOOKS } from "../data/content";
import { WRITINGS } from "../data/writings";

// Curated topic icons — maps normalized topic name fragments to emojis
const TOPIC_ICONS: Record<string, string> = {
  junagadh: "🏰",
  kathi: "🛡️",
  saurashtra: "⛰️",
  girnar: "⛰️",
  bhavnagar: "📜",
  porbandar: "🌊",
  rajkot: "🏙️",
  history: "📖",
  itihas: "📖",
  battle: "⚔️",
  ladai: "⚔️",
  freedom: "🏳️",
  swatantra: "🏳️",
  gandhi: "🕊️",
  temple: "🕌",
  mandir: "🕌",
  somnath: "🕉️",
  religion: "🙏",
  dharm: "🙏",
  dynasty: "👑",
  rajvansh: "👑",
  royal: "👑",
  rajvi: "👑",
  folk: "🎨",
  lok: "🎨",
  culture: "🎭",
  sanskriti: "🎭",
  biography: "👤",
  jivan: "👤",
  architecture: "🏛️",
  sthapatya: "🏛️",
  genealogy: "🌳",
  vanshavali: "🌳",
  epigraphy: "🪨",
  shilalekh: "🪨",
  village: "🏡",
  gam: "🏡",
  social: "👥",
  samaj: "👥",
};

function getTopicIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(TOPIC_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "📌";
}

// Color tiers by volume
function getTopicTier(count: number): string {
  if (count >= 20) return "tier-1";
  if (count >= 10) return "tier-2";
  if (count >= 5) return "tier-3";
  return "tier-4";
}

interface Video {
  tags: string[];
}

export default function TopicsPage() {
  usePageTitle("Topics & Research Clusters");
  const [videoTags, setVideoTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/videos.json")
      .then(res => res.json())
      .then(data => {
        const tags = (data.videos || []).flatMap((v: Video) => v.tags || []);
        setVideoTags(tags);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const topicClusters = useMemo(() => {
    const allTags = [
      ...videoTags,
      ...BOOKS.flatMap(b => [b.category]),
      ...WRITINGS.flatMap(w => w.tags || [])
    ];

    const counts: Record<string, number> = {};
    allTags.forEach(t => {
      if (!t) return;
      const normalized = t.toLowerCase().trim();
      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .filter(t => t.count > 1)
      .sort((a, b) => b.count - a.count);
  }, [videoTags]);

  const featured = topicClusters.slice(0, 3);
  const rest = topicClusters.slice(3);

  return (
    <main className="page-content">
      <PageHeader
        label="Archive Index"
        title="Topic Clusters"
        subtitle="Explore the research archive through curated subject clusters. From Royal Dynasties to Freedom Struggles — Dr. Khachar's life's work, indexed."
      />

      <section className="section">
        {loading ? (
          <div className="articles-loading"><div className="articles-loading-spinner" /></div>
        ) : (
          <>
            {/* Featured Topics (top 3 — large) */}
            {featured.length > 0 && (
              <div className="topics-featured-grid">
                {featured.map((topic) => (
                  <Link
                    key={topic.name}
                    to={`/explore?q=${topic.name}`}
                    className={`topic-card-featured ${getTopicTier(topic.count)}`}
                  >
                    <div className="topic-featured-icon">{getTopicIcon(topic.name)}</div>
                    <div className="topic-featured-name">{topic.name}</div>
                    <div className="topic-featured-count">
                      <span className="topic-count-pill">{topic.count}</span> items
                    </div>
                    <div className="topic-featured-arrow">Explore →</div>
                  </Link>
                ))}
              </div>
            )}

            {/* All Other Topics */}
            {rest.length > 0 && (
              <div className="topics-grid">
                {rest.map((topic) => (
                  <Link
                    key={topic.name}
                    to={`/explore?q=${topic.name}`}
                    className={`topic-card ${getTopicTier(topic.count)}`}
                  >
                    <div className="topic-card-inner">
                      <span className="topic-icon">{getTopicIcon(topic.name)}</span>
                      <div className="topic-name">{topic.name}</div>
                    </div>
                    <div className="topic-count-badge">{topic.count}</div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        <style>{`
          /* Featured row */
          .topics-featured-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-md);
            margin-bottom: var(--space-xl);
          }
          .topic-card-featured {
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border);
            padding: var(--space-xl);
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-sm);
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
          }
          .topic-card-featured::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: var(--c-terracotta);
            opacity: 0;
            transition: opacity 0.3s;
          }
          .topic-card-featured:hover::before { opacity: 1; }
          .topic-card-featured:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 50px oklch(0.1 0.05 60 / 0.1);
            border-color: var(--c-terracotta);
          }
          .topic-featured-icon {
            font-size: 2.5rem;
            line-height: 1;
            filter: drop-shadow(0 2px 4px oklch(0.1 0.05 60 / 0.15));
          }
          .topic-featured-name {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--c-ink);
            text-transform: capitalize;
          }
          .topic-featured-count {
            font-size: 0.78rem;
            color: var(--c-ink-muted);
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .topic-count-pill {
            background: color-mix(in oklch, var(--c-terracotta) 15%, transparent);
            color: var(--c-terracotta);
            border-radius: 20px;
            padding: 2px 8px;
            font-size: 0.72rem;
            font-weight: 700;
          }
          .topic-featured-arrow {
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--c-terracotta);
            letter-spacing: 0.05em;
            opacity: 0;
            transform: translateY(4px);
            transition: all 0.3s;
          }
          .topic-card-featured:hover .topic-featured-arrow {
            opacity: 1;
            transform: translateY(0);
          }

          /* Regular grid */
          .topics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: var(--space-sm);
          }
          .topic-card {
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border-light);
            padding: var(--space-md);
            text-align: left;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.25s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: var(--space-sm);
          }
          .topic-card:hover {
            border-color: var(--c-terracotta);
            background: var(--c-parchment);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px oklch(0.1 0.05 60 / 0.06);
          }
          .topic-card-inner {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            min-width: 0;
          }
          .topic-icon {
            font-size: 1.1rem;
            flex-shrink: 0;
          }
          .topic-name {
            font-family: var(--font-display);
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--c-ink);
            text-transform: capitalize;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .topic-count-badge {
            flex-shrink: 0;
            font-size: 0.65rem;
            font-weight: 700;
            color: var(--c-ink-muted);
            background: var(--c-border-light);
            border-radius: 20px;
            padding: 2px 7px;
            letter-spacing: 0.05em;
          }
          .topic-card:hover .topic-count-badge {
            background: color-mix(in oklch, var(--c-terracotta) 12%, transparent);
            color: var(--c-terracotta);
          }

          /* Tier color accents */
          .topic-card.tier-1 { border-left: 3px solid var(--c-terracotta); }
          .topic-card.tier-2 { border-left: 3px solid var(--c-amber); }
          .topic-card.tier-3 { border-left: 2px solid var(--c-border); }
          .topic-card-featured.tier-1 { background: color-mix(in oklch, var(--c-terracotta) 3%, var(--c-parchment-deep)); }

          @media (max-width: 768px) {
            .topics-featured-grid {
              grid-template-columns: 1fr;
            }
            .topics-grid {
              grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            }
          }
        `}</style>
      </section>
    </main>
  );
}
