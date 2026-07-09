/**
 * /stats — public, real-time analytics dashboard
 *
 * Reads from local analytics buffer (client-side, no backend required)
 * + pulls channel stats from /data/stats.json for the social media numbers
 */

import { useEffect, useState } from "react";
import {
  Activity,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import {
  getAnalyticsSnapshot,
  getLivePulse,
  clearAnalytics,
  AnalyticsState,
} from "../hooks/useAnalytics";
import { usePageTitle } from "../hooks/usePageTitle";
import { useTracker } from "../hooks/useAnalytics";
import PageHeader from "../components/PageHeader";

interface ChannelStats {
  youtube?: { subscribers: number; views: number };
  instagram?: { followers: number; posts: number };
  facebook?: { followers: number };
  videos: number;
  playlists: number;
  transcripts: number;
  totalDurationHours: number;
  lastUpdated: string;
}

export default function StatsPage() {
  usePageTitle("Live Stats");
  const track = useTracker();
  const [snapshot, setSnapshot] = useState(() => getAnalyticsSnapshot());
  const [pulse, setPulse] = useState(() => getLivePulse());
  const [channel, setChannel] = useState<ChannelStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    track("page_view", "/stats");
  }, [track]);

  useEffect(() => {
    const tick = () => {
      setSnapshot(getAnalyticsSnapshot());
      setPulse(getLivePulse());
    };
    const id = setInterval(tick, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/data/stats.json")
      .then((r) => r.json())
      .then((d) => setChannel(d))
      .catch(() => {});
  }, []);

  const refresh = () => {
    setRefreshing(true);
    setSnapshot(getAnalyticsSnapshot());
    setPulse(getLivePulse());
    setTimeout(() => setRefreshing(false), 400);
  };

  const totalSocialFollowers =
    (channel?.youtube?.subscribers || 0) +
    (channel?.instagram?.followers || 0) +
    (channel?.facebook?.followers || 0);

  const totalReach =
    (channel?.youtube?.views || 0) +
    (channel?.instagram?.posts || 0);

  return (
    <>
      <PageHeader
        label="Telemetry"
        title="Live Stats"
        subtitle="Real-time activity from visitors on this site. No cookies, no tracking pixels — just a small local buffer for transparency."
        dark
      />

      <main className="section stats-page">
        <style>{`
          .stats-page { padding-top: 0; }
          .stats-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-lg);
            flex-wrap: wrap;
            gap: 1rem;
          }
          .stats-status {
            display: flex;
            gap: 0.6rem;
            align-items: center;
            font-family: var(--font-body);
            font-size: 0.8rem;
            color: var(--c-ink-muted);
          }
          .stats-status .dot {
            width: 8px; height: 8px; border-radius: 50%;
            background: #4ade80; box-shadow: 0 0 8px #4ade80;
            animation: pulse-dot 2s infinite;
          }
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .stats-refresh {
            background: var(--c-border-light);
            border: 1px solid var(--c-border);
            border-radius: 8px;
            padding: 6px 12px;
            font-family: var(--font-body);
            font-size: 0.78rem;
            cursor: pointer;
            color: var(--c-ink-soft);
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          }
          .stats-refresh:hover { color: var(--c-terracotta); }
          .stats-refresh.spin svg { animation: spin 1s linear; }
          @keyframes spin { to { transform: rotate(360deg); } }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .stat-card {
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border);
            border-radius: 14px;
            padding: 1.4rem 1.2rem;
            position: relative;
            overflow: hidden;
          }
          [data-theme="dark"] .stat-card {
            background: rgba(255,255,255,0.03);
            border-color: rgba(255,255,255,0.08);
          }
          .stat-card::after {
            content: ""; position: absolute; top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--c-terracotta), var(--c-amber));
            opacity: 0.5;
          }
          .stat-icon {
            width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 8px;
            background: color-mix(in oklch, var(--c-terracotta) 12%, transparent);
            color: var(--c-terracotta);
            margin-bottom: 0.8rem;
          }
          .stat-label {
            font-family: var(--font-body);
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--c-ink-muted);
            margin-bottom: 0.4rem;
          }
          .stat-value {
            font-family: var(--font-display);
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--c-ink);
            line-height: 1;
            margin-bottom: 0.3rem;
          }
          .stat-sub {
            font-family: var(--font-body);
            font-size: 0.78rem;
            color: var(--c-ink-muted);
          }
          .stat-sub strong { color: var(--c-terracotta); }

          .pulse-card {
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border);
            border-radius: 14px;
            padding: 1.2rem 1.4rem;
            margin-bottom: 2rem;
          }
          [data-theme="dark"] .pulse-card {
            background: rgba(255,255,255,0.03);
            border-color: rgba(255,255,255,0.08);
          }
          .pulse-title {
            display: flex; align-items: center; gap: 0.5rem;
            font-family: var(--font-display); font-size: 0.95rem;
            font-weight: 600; color: var(--c-ink); margin-bottom: 1rem;
          }
          .pulse-bars {
            display: flex; align-items: flex-end; gap: 6px;
            height: 90px;
          }
          .pulse-bar {
            flex: 1;
            background: linear-gradient(180deg, var(--c-terracotta), var(--c-amber));
            border-radius: 4px 4px 0 0;
            min-height: 4px;
            transition: height 0.4s ease;
            position: relative;
          }
          .pulse-bar:hover { opacity: 0.8; }
          .pulse-bar:hover::after {
            content: attr(data-tip);
            position: absolute; top: -22px; left: 50%; transform: translateX(-50%);
            background: var(--c-ink); color: var(--c-parchment);
            font-size: 0.65rem; padding: 2px 6px; border-radius: 4px;
            white-space: nowrap; font-family: var(--font-body);
          }
          .pulse-axis {
            display: flex; justify-content: space-between;
            font-family: var(--font-body);
            font-size: 0.7rem; color: var(--c-ink-muted);
            margin-top: 0.5rem;
          }

          .stats-section {
            background: var(--c-parchment-deep);
            border: 1px solid var(--c-border);
            border-radius: 14px;
            padding: 1.4rem;
            margin-bottom: 1.5rem;
          }
          [data-theme="dark"] .stats-section {
            background: rgba(255,255,255,0.03);
            border-color: rgba(255,255,255,0.08);
          }
          .stats-section h3 {
            font-family: var(--font-display);
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--c-ink);
            margin-bottom: 1rem;
            display: flex; align-items: center; gap: 0.5rem;
          }
          .stats-row {
            display: flex; justify-content: space-between;
            align-items: center;
            padding: 0.6rem 0;
            border-bottom: 1px solid var(--c-border-light);
            font-family: var(--font-body);
            font-size: 0.88rem;
          }
          [data-theme="dark"] .stats-row { border-color: rgba(255,255,255,0.05); }
          .stats-row:last-child { border-bottom: none; }
          .stats-row .label { color: var(--c-ink-soft); flex: 1; }
          .stats-row .count {
            color: var(--c-terracotta);
            font-weight: 700;
            font-variant-numeric: tabular-nums;
          }
          .stats-bar {
            height: 4px;
            background: var(--c-border-light);
            border-radius: 2px;
            margin-top: 4px;
            overflow: hidden;
          }
          [data-theme="dark"] .stats-bar { background: rgba(255,255,255,0.05); }
          .stats-bar-fill {
            height: 100%;
            background: var(--c-terracotta);
            border-radius: 2px;
            transition: width 0.4s ease;
          }

          .stats-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
          @media (max-width: 768px) {
            .stats-grid-2 { grid-template-columns: 1fr; }
          }

          .recent-events {
            max-height: 320px;
            overflow-y: auto;
            font-family: var(--font-mono, monospace);
            font-size: 0.78rem;
          }
          .recent-event {
            display: flex; gap: 0.6rem;
            padding: 0.4rem 0;
            border-bottom: 1px solid var(--c-border-light);
            color: var(--c-ink-muted);
          }
          [data-theme="dark"] .recent-event { border-color: rgba(255,255,255,0.05); }
          .recent-event .ts { color: var(--c-ink-muted); white-space: nowrap; }
          .recent-event .type { color: var(--c-terracotta); font-weight: 600; }
          .recent-event .path { color: var(--c-ink-soft); }

          .channel-summary {
            display: flex; gap: 1.5rem; flex-wrap: wrap;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--c-border-light);
          }
          .channel-stat { flex: 1; min-width: 140px; }
          .channel-stat .name { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--c-ink-muted); }
          .channel-stat .value { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--c-ink); margin-top: 0.2rem; }

          .clear-btn {
            background: none; border: 1px solid var(--c-border);
            color: var(--c-ink-muted);
            font-family: var(--font-body); font-size: 0.75rem;
            padding: 4px 10px; border-radius: 6px; cursor: pointer;
            margin-top: 0.5rem;
            transition: all 0.2s;
          }
          .clear-btn:hover { color: var(--c-terracotta); border-color: var(--c-terracotta); }
        `}</style>

        {/* Toolbar */}
        <div className="stats-toolbar">
          <div className="stats-status">
            <span className="dot" />
            <span>
              {snapshot.online ? "Live" : "Offline"} · Session {snapshot.sessionId.slice(-6)}
            </span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{snapshot.deviceType === "mobile" ? <Smartphone size={14} /> : snapshot.deviceType === "tablet" ? <Tablet size={14} /> : <Monitor size={14} />}</span>
            <span style={{ textTransform: "capitalize" }}>{snapshot.deviceType}</span>
          </div>
          <button
            className={`stats-refresh${refreshing ? " spin" : ""}`}
            onClick={refresh}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Top stat cards */}
        <div className="stats-grid">
          <StatCard
            icon={<Eye size={16} />}
            label="Page Views (This Browser)"
            value={Object.values(snapshot.pageViews).reduce((a, b) => a + b, 0)}
            sub={`Across ${Object.keys(snapshot.pageViews).length} unique paths`}
          />
          <StatCard
            icon={<Activity size={16} />}
            label="Events Captured"
            value={snapshot.totalEvents}
            sub={
              <>
                <strong>{snapshot.eventsLast24h}</strong> in 24h ·{" "}
                <strong>{snapshot.eventsLast7d}</strong> in 7d
              </>
            }
          />
          <StatCard
            icon={<Clock size={16} />}
            label="Time on Site"
            value={formatDuration(snapshot.totalTimeOnSite)}
            sub="Cumulative dwell time"
          />
          <StatCard
            icon={<Globe size={16} />}
            label="Channel Reach"
            value={formatBig(totalSocialFollowers)}
            sub={`${formatBig(channel?.youtube?.views || 0)} lifetime views`}
          />
        </div>

        {/* Pulse */}
        <div className="pulse-card">
          <h3 className="pulse-title">
            <Activity size={16} /> Live Pulse · Last 60 Minutes
          </h3>
          <div className="pulse-bars">
            {pulse.map((v, i) => {
              const max = Math.max(...pulse, 1);
              const h = (v / max) * 100;
              const minutesAgo = (11 - i) * 5;
              return (
                <div
                  key={i}
                  className="pulse-bar"
                  style={{ height: `${Math.max(h, 4)}%` }}
                  data-tip={`${v} events · ${minutesAgo}m ago`}
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

        {/* Two columns: top pages + top events */}
        <div className="stats-grid-2">
          <div className="stats-section">
            <h3>
              <TrendingUp size={16} /> Top Pages
            </h3>
            {snapshot.topPages.length === 0 ? (
              <p style={{ color: "var(--c-ink-muted)", fontSize: "0.85rem" }}>
                No page views yet in this browser.
              </p>
            ) : (
              snapshot.topPages.map((p) => {
                const max = snapshot.topPages[0]?.count || 1;
                return (
                  <div key={p.path}>
                    <div className="stats-row">
                      <span className="label">{p.path}</span>
                      <span className="count">{p.count}</span>
                    </div>
                    <div className="stats-bar">
                      <div
                        className="stats-bar-fill"
                        style={{ width: `${(p.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="stats-section">
            <h3>
              <Activity size={16} /> Top Events
            </h3>
            {snapshot.topEvents.length === 0 ? (
              <p style={{ color: "var(--c-ink-muted)", fontSize: "0.85rem" }}>
                No events yet. Interact with the site to see them appear.
              </p>
            ) : (
              snapshot.topEvents.map((e) => {
                const max = snapshot.topEvents[0]?.count || 1;
                return (
                  <div key={e.type}>
                    <div className="stats-row">
                      <span className="label">{e.type}</span>
                      <span className="count">{e.count}</span>
                    </div>
                    <div className="stats-bar">
                      <div
                        className="stats-bar-fill"
                        style={{ width: `${(e.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent events */}
        <div className="stats-section">
          <h3>
            <ArrowUpRight size={16} /> Recent Activity
          </h3>
          {snapshot.recentEvents.length === 0 ? (
            <p style={{ color: "var(--c-ink-muted)", fontSize: "0.85rem" }}>
              Click around the site — your events will appear here in real-time.
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
              if (confirm("Clear all locally stored analytics?")) clearAnalytics();
              refresh();
            }}
          >
            Clear local data
          </button>
        </div>

        {/* Channel summary */}
        {channel && (
          <div className="stats-section">
            <h3>
              <Globe size={16} /> Channel Reach (from scraper)
            </h3>
            <p style={{ color: "var(--c-ink-muted)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              Last updated {new Date(channel.lastUpdated).toLocaleString()}
            </p>
            <div className="channel-summary">
              <div className="channel-stat">
                <div className="name">YouTube Subs</div>
                <div className="value">{formatBig(channel.youtube?.subscribers || 0)}</div>
              </div>
              <div className="channel-stat">
                <div className="name">YouTube Views</div>
                <div className="value">{formatBig(channel.youtube?.views || 0)}</div>
              </div>
              <div className="channel-stat">
                <div className="name">Instagram</div>
                <div className="value">{formatBig(channel.instagram?.followers || 0)}</div>
              </div>
              <div className="channel-stat">
                <div className="name">Facebook</div>
                <div className="value">{formatBig(channel.facebook?.followers || 0)}</div>
              </div>
              <div className="channel-stat">
                <div className="name">Videos</div>
                <div className="value">{channel.videos}</div>
              </div>
              <div className="channel-stat">
                <div className="name">Transcripts</div>
                <div className="value">{channel.transcripts}</div>
              </div>
              <div className="channel-stat">
                <div className="name">Hours of Content</div>
                <div className="value">{channel.totalDurationHours}h</div>
              </div>
              <div className="channel-stat">
                <div className="name">Playlists</div>
                <div className="value">{channel.playlists}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "var(--c-ink-muted)", textAlign: "center" }}>
          Stats are also sent to Vercel Analytics (anonymous, aggregated) for the project dashboard.
        </div>
      </main>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: React.ReactNode;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
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

function formatBig(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
