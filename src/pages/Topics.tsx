import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { BOOKS } from "../data/content";
import { WRITINGS } from "../data/writings";

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
      ...BOOKS.flatMap(b => [b.category]), // Use categories as topics too
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
      .filter(t => t.count > 2) // Only show significant topics
      .sort((a, b) => b.count - a.count);
  }, [videoTags]);

  return (
    <main className="page-content">
      <PageHeader
        label="Archive Index"
        title="Topic Clusters"
        subtitle="Explore the research archive through curated subject clusters. From Royal Dynasties to Freedom Struggles."
      />

      <section className="section">
        {loading ? (
          <div className="articles-loading"><div className="articles-loading-spinner" /></div>
        ) : (
          <div className="topics-grid">
            {topicClusters.map((topic) => (
              <Link 
                key={topic.name} 
                to={`/explore?q=${topic.name}`}
                className="topic-card"
              >
                <div className="topic-name">{topic.name}</div>
                <div className="topic-count">{topic.count} items</div>
              </Link>
            ))}
          </div>
        )}

        <style>{`
          .topics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: var(--space-md);
          }
          .topic-card {
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border-light);
            padding: var(--space-lg);
            text-align: center;
            transition: all 0.3s ease;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
            aspect-ratio: 1/1;
            border-radius: 4px;
          }
          .topic-card:hover {
            border-color: var(--c-terracotta);
            background: var(--c-parchment);
            transform: translateY(-4px);
            box-shadow: 0 10px 30px oklch(0.1 0.05 60 / 0.08);
          }
          .topic-name {
            font-family: var(--font-display);
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--c-ink);
            text-transform: capitalize;
            margin-bottom: 0.5rem;
          }
          .topic-count {
            font-size: 0.72rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--c-ink-muted);
          }
        `}</style>
      </section>
    </main>
  );
}
