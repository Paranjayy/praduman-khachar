/**
 * useAnalytics — robust client-side analytics layer
 *
 * - Wraps Vercel Analytics (track) for the Vercel dashboard
 * - Also records events in localStorage so we can show a public /stats page
 *   that updates in real-time without a backend
 * - Tracks: page views, time on page, scroll depth, clicks, downloads,
 *   search, share, social, theme toggle, lang switch, command palette
 */

import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { track as vercelTrack } from "@vercel/analytics";

const STORAGE_KEY = "pk_analytics_v1";
const SESSION_KEY = "pk_session_v1";

interface AnalyticsEvent {
  id: string;
  type: string;
  label?: string;
  meta?: Record<string, any>;
  ts: number;
  path?: string;
  referrer?: string;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  pageViews: Record<string, number>;
  sessions: { id: string; startedAt: number; ua: string; }[];
  totalTimeOnSite: number;
  firstSeen: number;
}

const SESSION_LENGTH_MS = 30 * 60 * 1000; // 30 min idle = new session

function safeRead(): AnalyticsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    events: [],
    pageViews: {},
    sessions: [],
    totalTimeOnSite: 0,
    firstSeen: Date.now(),
  };
}

function safeWrite(state: AnalyticsState) {
  try {
    // cap events to last 500 to avoid blowing up storage
    const trimmed = {
      ...state,
      events: state.events.slice(-500),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
}

function getSession(): string {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.lastActivity < SESSION_LENGTH_MS) {
        parsed.lastActivity = Date.now();
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
        return parsed.id;
      }
    }
  } catch {}
  const id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id, startedAt: Date.now(), lastActivity: Date.now() }),
    );
  } catch {}
  return id;
}

export function recordEvent(
  type: string,
  label?: string,
  meta?: Record<string, any>,
  path?: string,
) {
  const event: AnalyticsEvent = {
    id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    label,
    meta,
    ts: Date.now(),
    path: path || (typeof window !== "undefined" ? window.location.pathname : ""),
    referrer:
      typeof document !== "undefined" ? document.referrer || undefined : undefined,
  };
  const state = safeRead();
  state.events.push(event);
  if (type === "page_view" && label) {
    state.pageViews[label] = (state.pageViews[label] || 0) + 1;
  }
  safeWrite(state);

  // also fire to vercel
  if (type === "page_view") {
    vercelTrack("page_view", { path: label });
  } else {
    vercelTrack(type, { label, ...meta });
  }
}

export function usePageTracking() {
  const location = useLocation();
  const enteredAt = useRef<number>(Date.now());

  useEffect(() => {
    enteredAt.current = Date.now();
    recordEvent("page_view", location.pathname);

    return () => {
      const dwell = Date.now() - enteredAt.current;
      if (dwell > 1000) {
        const state = safeRead();
        state.totalTimeOnSite += dwell;
        safeWrite(state);
        vercelTrack("page_dwell", { path: location.pathname, ms: dwell });
      }
    };
  }, [location.pathname]);
}

export function useScrollDepth() {
  const location = useLocation();
  const milestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    milestones.current = new Set();
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m && !milestones.current.has(m)) {
          milestones.current.add(m);
          recordEvent("scroll_depth", `${m}%`, { path: location.pathname });
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [location.pathname]);
}

export function useTracker() {
  return useCallback(
    (type: string, label?: string, meta?: Record<string, any>) => {
      recordEvent(type, label, meta);
    },
    [],
  );
}

export function getAnalyticsSnapshot() {
  const state = safeRead();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Build aggregated stats
  const eventsByType: Record<string, number> = {};
  const eventsByLabel: Record<string, number> = {};
  const eventsByPath: Record<string, number> = {};
  const recentEvents = [...state.events].sort((a, b) => b.ts - a.ts);

  for (const e of state.events) {
    eventsByType[e.type] = (eventsByType[e.type] || 0) + 1;
    if (e.label) eventsByLabel[e.label] = (eventsByLabel[e.label] || 0) + 1;
    if (e.path) eventsByPath[e.path] = (eventsByPath[e.path] || 0) + 1;
  }

  const last24h = state.events.filter((e) => now - e.ts < oneDay);
  const last7d = state.events.filter((e) => now - e.ts < 7 * oneDay);

  // Top pages
  const topPages = Object.entries(state.pageViews)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  // Top events
  const topEvents = Object.entries(eventsByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type, count]) => ({ type, count }));

  return {
    totalEvents: state.events.length,
    eventsLast24h: last24h.length,
    eventsLast7d: last7d.length,
    pageViews: state.pageViews,
    topPages,
    topEvents,
    eventsByType,
    eventsByPath,
    recentEvents: recentEvents.slice(0, 30),
    totalTimeOnSite: state.totalTimeOnSite,
    firstSeen: state.firstSeen,
    sessionId: getSession(),
    deviceType: /Mobi|Android/i.test(navigator.userAgent)
      ? "mobile"
      : /iPad|Tablet/i.test(navigator.userAgent)
        ? "tablet"
        : "desktop",
    online: navigator.onLine,
  };
}

export function clearAnalytics() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function getLivePulse() {
  // Last 60 minutes bucketed per 5min
  const state = safeRead();
  const now = Date.now();
  const buckets: number[] = new Array(12).fill(0);
  for (const e of state.events) {
    const age = now - e.ts;
    if (age > 60 * 60 * 1000) continue;
    const idx = Math.floor(age / (5 * 60 * 1000));
    const bucketIdx = 11 - idx;
    if (bucketIdx >= 0 && bucketIdx < 12) buckets[bucketIdx]++;
  }
  return buckets;
}
