/**
 * OnThisDay.tsx
 *
 * Picks videos published on today's date (month + day) in any past year,
 * and surfaces them as a "On This Day in History" widget on the Home page.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Video {
  id: string;
  title: string;
  slug?: string;
  publishedAt: string;
  thumbnail?: string;
  views?: string;
  durationSeconds?: number;
}

function fmtDuration(s: number) {
  if (!s) return "";
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function OnThisDay() {
  const [matches, setMatches] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/videos.json")
      .then(r => r.json())
      .then(data => {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");

        const hits: Video[] = (data.videos || []).filter((v: Video) => {
          if (!v.publishedAt || v.publishedAt.startsWith("NA")) return false;
          const d = new Date(v.publishedAt);
          if (isNaN(d.getTime())) return false;
          // Must be a previous year, same month+day
          if (d.getFullYear() >= today.getFullYear()) return false;
          const vm = String(d.getMonth() + 1).padStart(2, "0");
          const vd = String(d.getDate()).padStart(2, "0");
          return vm === mm && vd === dd;
        });

        // Sort by year descending, take up to 3
        hits.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        setMatches(hits.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || matches.length === 0) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", { month: "long", day: "numeric" });

  return (
    <section className="otd-section">
      <div className="otd-inner">
        <div className="otd-header">
          <span className="otd-icon">📅</span>
          <div>
            <p className="otd-label">On This Day</p>
            <h2 className="otd-title">{dateStr} — In History</h2>
          </div>
        </div>

        <div className="otd-grid">
          {matches.map(v => {
            const year = new Date(v.publishedAt).getFullYear();
            const slug = v.slug || v.id;
            return (
              <Link
                to={`/articles/${slug}`}
                key={v.id}
                className="otd-card"
                title={v.title}
              >
                {v.thumbnail && (
                  <div className="otd-thumb">
                    <img src={v.thumbnail} alt={v.title} loading="lazy" />
                    {v.durationSeconds ? (
                      <span className="otd-duration">{fmtDuration(v.durationSeconds)}</span>
                    ) : null}
                  </div>
                )}
                <div className="otd-card-body">
                  <span className="otd-year">{year}</span>
                  <p className="otd-card-title">{v.title}</p>
                  {v.views && <span className="otd-views">{v.views} views</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
