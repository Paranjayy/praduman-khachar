/**
 * /stats — local debug dashboard
 *
 * NOTE: This page shows your own browser's local analytics buffer for debugging.
 * The real, accurate stats (visits, page views, devices, geography) live in the
 * Vercel Analytics dashboard for this project — not on this page.
 *
 * In production this is hidden behind a `?key` query string so it doesn't get
 * shared around as a "live stats" page. The official analytics:
 * https://vercel.com/<team>/praduman-khachar/analytics
 */

import { useEffect, useState } from "react";
import {
  Activity,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  ArrowUpRight,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  getAnalyticsSnapshot,
  getLivePulse,
  clearAnalytics,
} from "../hooks/useAnalytics";
import { usePageTitle } from "../hooks/usePageTitle";
import { useTracker } from "../hooks/useAnalytics";
import PageHeader from "../components/PageHeader";

const ACCESS_KEY = "pk2026"; // simple gate; not security, just a courtesy

export default function StatsPage() {
  usePageTitle("Stats (Local Debug)");
  const track = useTracker();
  const [snapshot, setSnapshot] = useState(() => getAnalyticsSnapshot());
  const [pulse, setPulse] = useState(() => getLivePulse());
  const [refreshing, setRefreshing] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("key") === ACCESS_KEY) {
      setUnlocked(true);
      sessionStorage.setItem("pk_stats_unlocked", "1");
    } else if (sessionStorage.getItem("pk_stats_unlocked") === "1") {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    track("stats_unlocked");
    const tick = () => {
      setSnapshot(getAnalyticsSnapshot());
      setPulse(getLivePulse());
    };
    const id = setInterval(tick, 4000);
    return () => clearInterval(id);
  }, [unlocked, track]);

  if (!unlocked) {
    return (
      <main className="section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: "0 1.5rem" }}>
          <Info size={32} style={{ color: "var(--c-terracotta)", marginBottom: 12 }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: 8 }}>
            Local Debug View
          </h2>
          <p style={{ color: "var(--c-ink-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            This page shows your own browser's local analytics buffer for
            debugging purposes only. The real visitor stats are in the
            Vercel Analytics dashboard.
          </p>
          <p style={{ color: "var(--c-ink-muted)", fontSize: "0.8rem", marginTop: 12 }}>
            Append <code style={{ background: "var(--c-border-light)", padding: "2px 6px", borderRadius: 4 }}>?key=pk2026</code> to unlock.
          </p>
        </div>
      </main>
    );
  }

  const refresh = () => {
    setRefreshing(true);
    setSnapshot(getAnalyticsSnapshot());
    setPulse(getLivePulse());
    setTimeout(() => setRefreshing(false), 400);
  };

  return (
    <>
      <PageHeader
        label="Local Debug"
        title="Your Browser Buffer"
        subtitle="This view shows only the events from THIS browser. Real aggregate stats live in the Vercel Analytics dashboard."
        dark
      />

      <main className="section stats-page" style={{ paddingTop: 0 }}>
        <div
          style={{
            background: "color-mix(in oklch, var(--c-amber) 12%, transparent)",
            border: "1px solid color-mix(in oklch, var(--c-amber) 35%, transparent)",
            padding: "0.8rem 1rem",
            borderRadius: 8,
            fontSize: "0.82rem",
            color: "var(--c-ink-soft)",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-body)",
          }}
        >
          ⚠️ This is your local browser buffer only. For real visitor numbers, page
          views, devices, and geography, see the Vercel Analytics dashboard.
        </div>

        <div className="stats-toolbar">
          <div className="stats-status">
            <span>Session {snapshot.sessionId.slice(-6)}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {snapshot.deviceType === "mobile" ? <Smartphone size={14} /> : snapshot.deviceType === "tablet" ? <Tablet size={14} /> : <Monitor size={14} />}
              <span style={{ textTransform: "capitalize" }}>{snapshot.deviceType}</span>
            </span>
          </div>
          <button className={`stats-refresh${refreshing ? " spin" : ""}`} onClick={refresh}>
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Eye size={16} /></div>
            <div className="stat-label">Page Views (This Browser)</div>
            <div className="stat-value">{Object.values(snapshot.pageViews).reduce((a, b) => a + b, 0)}</div>
            <div className="stat-sub">Across {Object.keys(snapshot.pageViews).length} paths</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Activity size={16} /></div>
            <div className="stat-label">Events Captured</div>
            <div className="stat-value">{snapshot.totalEvents}</div>
            <div className="stat-sub">
              <strong>{snapshot.eventsLast24h}</strong> in 24h · <strong>{snapshot.eventsLast7d}</strong> in 7d
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Clock size={16} /></div>
            <div className="stat-label">Time on Site</div>
            <div className="stat-value">{formatDuration(snapshot.totalTimeOnSite)}</div>
            <div className="stat-sub">Cumulative dwell time</div>
          </div>
        </div>

        <div className="pulse-card">
          <h3 className="pulse-title">
            <Activity size={16} /> Local Pulse · Last 60 Minutes
          </h3>
          <div className="pulse-bars">
            {pulse.map((v, i) => {
              const max = Math.max(...pulse, 1);
              const h = (v / max) * 100;
              return (
                <div
                  key={i}
                  className="pulse-bar"
                  style={{ height: `${Math.max(h, 4)}%` }}
                  data-tip={`${v} events`}
                />
              );
            })}
          </div>
          <div className="pulse-axis">
            <span>60m ago</span>
            <span>30m</span>
            <span>now</span>
          </div>
        </div>

        <div className="stats-section">
          <h3><ArrowUpRight size={16} /> Recent Activity (this browser)</h3>
          {snapshot.recentEvents.length === 0 ? (
            <p style={{ color: "var(--c-ink-muted)", fontSize: "0.85rem" }}>
              No events yet. Click around the site to populate the buffer.
            </p>
          ) : (
            <div className="recent-events">
              {snapshot.recentEvents.map((e) => (
                <div key={e.id} className="recent-event">
                  <span className="ts">{new Date(e.ts).toLocaleTimeString()}</span>
                  <span className="type">{e.type}</span>
                  {e.label && <span className="path">{e.label}</span>}
                </div>
              ))}
            </div>
          )}
          <button
            className="clear-btn"
            onClick={() => {
              if (confirm("Clear local analytics buffer?")) clearAnalytics();
              refresh();
            }}
          >
            Clear local data
          </button>
        </div>
      </main>
    </>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return "0s";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
