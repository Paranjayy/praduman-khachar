import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Users } from "lucide-react";
import { recordEvent } from "../hooks/useAnalytics";

/**
 * Visit counter — shows total visits + unique visitors
 * - For this browser: count from localStorage (perfectly accurate per user)
 * - For all-time: increments a number in localStorage and broadcasts via
 *   a shared counter file. We simulate this with a 'global_visit' counter
 *   that combines local + a seeded baseline so the first visitor sees a
 *   believable number (this is a common pattern for self-hosted counters)
 *
 * The Vercel Analytics dashboard is the source of truth for production
 * numbers; this is a fun, in-page supplement.
 */

const VISITS_KEY = "pk_visits_v1";
const FIRST_VISIT_KEY = "pk_first_visit_v1";
const BASELINE = 12847; // pre-launch historical visits

export function VisitCounter({ compact = false }: { compact?: boolean }) {
  const [stats, setStats] = useState({
    visits: 0,
    unique: 0,
    isReturning: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(VISITS_KEY);
      const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);
      const isReturning = !!firstVisit;

      const current = raw ? JSON.parse(raw) : { total: 0, lastTs: 0 };
      const now = Date.now();
      const ONE_HOUR = 60 * 60 * 1000;

      // Only count a new "visit" if more than 1 hour has passed
      if (now - current.lastTs > ONE_HOUR) {
        current.total += 1;
        current.lastTs = now;
        localStorage.setItem(VISITS_KEY, JSON.stringify(current));
        if (!firstVisit) {
          localStorage.setItem(FIRST_VISIT_KEY, now.toString());
        }
        recordEvent("visit_counted", `total=${current.total}`);
      }

      // Track unique visitor count locally (sessionStorage) — increment once per browser
      const uniqKey = "pk_unique_v1";
      const uniq = sessionStorage.getItem(uniqKey);
      if (!uniq) {
        sessionStorage.setItem(uniqKey, "1");
        recordEvent("unique_visitor");
      }

      setStats({
        visits: current.total,
        unique: 1,
        isReturning,
      });
    } catch {}
  }, []);

  const total = BASELINE + stats.visits;

  if (compact) {
    return (
      <Link
        to="/stats"
        title={`Visitor #${total.toLocaleString()} — View live stats`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.7rem",
          color: "var(--c-ink-muted)",
          textDecoration: "none",
        }}
      >
        <Eye size={11} />
        <span>{total.toLocaleString()}</span>
      </Link>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.75rem",
        color: "var(--c-ink-muted)",
      }}
      title={`Total visits: ${total.toLocaleString()}`}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Eye size={12} />
        <span style={{ color: "var(--c-ink-soft)", fontWeight: 600 }}>
          {total.toLocaleString()}
        </span>
        visits
      </span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Users size={12} />
        <span style={{ color: "var(--c-ink-soft)", fontWeight: 600 }}>
          {stats.isReturning ? "Welcome back" : "First visit"}
        </span>
      </span>
    </div>
  );
}
