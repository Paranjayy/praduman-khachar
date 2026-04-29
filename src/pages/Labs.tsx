/**
 * src/pages/Labs.tsx
 *
 * Labs — experimental tools and browser extensions built around Dr. Khachar's
 * work. Currently showcases Abhilekh Patal — the Gujarati heritage document
 * downloader extension.
 */

import { useReveal } from "../hooks/useAnimations";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "@vercel/analytics";

// ─── Lab Project card ─────────────────────────────────────────────────────────
interface LabProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: "stable" | "beta" | "wip";
  platform: string;
  icon: string;
  gradient: [string, string];
  features: string[];
  installUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
}

const PROJECTS: LabProject[] = [
  {
    id: "abhilekh-patal",
    name: "Abhilekh Patal",
    tagline: "Heritage Document Downloader",
    description:
      "A browser extension that augments the National Archives of India's " +
      "Abhilekh Patal portal with one-click document download, print-to-PDF, " +
      "and keyboard shortcuts. Designed to help historians and researchers access " +
      "digitised manuscripts efficiently.",
    status: "beta",
    platform: "Chrome Extension",
    icon: "📜",
    gradient: ["#8B6914", "#C49A2A"],
    features: [
      "One-click PDF download from archive viewer",
      "Keyboard shortcut: Alt+D to download",
      "Quick-print overlay (Ctrl+P support)",
      "Multi-strategy PDF URL extraction",
      "Works on itemdetails & readcontent pages",
    ],
    githubUrl: "https://github.com/Paranjayy/praduman-khachar",
  },
  {
    id: "transcript-explorer",
    name: "Transcript Explorer",
    tagline: "AI-Powered Gujarati Video Search",
    description:
      "Full-text search across 575+ Gujarati and Hindi historical lecture transcripts. " +
      "Find any moment in Dr. Khachar's YouTube archive by searching keywords, topics, " +
      "or even partial Gujarati phrases. Available inside the Explore page.",
    status: "stable",
    platform: "Web App",
    icon: "🔍",
    gradient: ["#1565C0", "#1E88E5"],
    features: [
      "575+ video transcripts indexed",
      "Cross-language search (GU/HI/EN)",
      "Instant snippet preview with context",
      "Direct YouTube timestamp deep-links",
      "Compact, grid, and table view modes",
    ],
    docsUrl: "/explore",
  },
  {
    id: "video-archiver",
    name: "Channel Archiver",
    tagline: "Automated YouTube Archive Pipeline",
    description:
      "A Node.js pipeline that scrapes Dr. Khachar's entire YouTube channel, " +
      "extracting transcripts via yt-dlp, metadata via YouTube's embedded JSON, " +
      "and social stats via public analytics endpoints. Produces a fully searchable " +
      "JSON archive updated on each run.",
    status: "stable",
    platform: "Node.js Script",
    icon: "⚙️",
    gradient: ["#2E7D32", "#43A047"],
    features: [
      "Full channel enumeration (videos + shorts + streams)",
      "Gujarati/Hindi transcript extraction via yt-dlp",
      "Resumable — skips already-scraped videos",
      "Extracts: views, likes, comments, duration, date",
      "Outputs: videos.json, stats.json",
    ],
    githubUrl: "https://github.com/Paranjayy/praduman-khachar",
  },
];

const STATUS_CONFIG = {
  stable: { label: "Stable",    color: "#2E7D32", bg: "rgba(46,125,50,0.12)" },
  beta:   { label: "Beta",      color: "#E65100", bg: "rgba(230,81,0,0.12)" },
  wip:    { label: "In Dev",    color: "#7B1FA2", bg: "rgba(123,31,162,0.12)" },
};

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: LabProject; index: number }) {
  const [ref, visible] = useReveal(0.1);
  const status = STATUS_CONFIG[project.status];

  return (
    <div
      ref={ref}
      className="lab-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s ${index * 0.12}s ease`,
      }}
    >
      {/* Header with gradient */}
      <div
        className="lab-card-header"
        style={{ background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})` }}
      >
        <span className="lab-card-icon">{project.icon}</span>
        <div className="lab-card-header-text">
          <h2 className="lab-card-name">{project.name}</h2>
          <p className="lab-card-tagline">{project.tagline}</p>
        </div>
        <div className="lab-card-badges">
          <span className="lab-platform-badge">{project.platform}</span>
          <span
            className="lab-status-badge"
            style={{ color: status.color, background: status.bg, border: `1px solid ${status.color}44` }}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="lab-card-body">
        <p className="lab-desc">{project.description}</p>

        <div className="lab-features">
          <h4 className="lab-features-title">Features</h4>
          <ul className="lab-features-list">
            {project.features.map((f, i) => (
              <li key={i} className="lab-feature-item">
                <span className="lab-feature-dot">◆</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="lab-actions">
          {project.installUrl && (
            <a
              href={project.installUrl}
              className="lab-btn lab-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("labs_install", { id: project.id })}
            >
              ⬇ Install Extension
            </a>
          )}
          {project.docsUrl && (
            <a
              href={project.docsUrl}
              className="lab-btn lab-btn-secondary"
              onClick={() => track("labs_docs", { id: project.id })}
            >
              {project.docsUrl.startsWith("http") ? "→ Open ↗" : "→ Try It"}
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="lab-btn lab-btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("labs_github", { id: project.id })}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LabsPage() {
  usePageTitle("Labs");

  return (
    <>
      <PageHeader
        label="Labs"
        title="Experimental Tools"
        subtitle="Open-source tools, browser extensions, and data pipelines built around Dr. Khachar's scholarly work."
        dark
      />

      <main className="section labs-page">
        {/* Intro */}
        <div className="labs-intro">
          <div className="labs-intro-icon">⚗️</div>
          <p className="labs-intro-text">
            These are tools built by the community to make Dr. Khachar's historical research
            more accessible. Contributions and feedback are welcome via GitHub.
          </p>
        </div>

        {/* Projects */}
        <div className="labs-grid">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Abhilekh Patal install instructions */}
        <div className="labs-install-guide">
          <h2 className="labs-install-title">Installing Abhilekh Patal</h2>
          <div className="labs-install-steps">
            {[
              { step: "1", title: "Download the extension", desc: "Download the abhilekh-patal-ext folder from the GitHub repository." },
              { step: "2", title: "Open Chrome Extensions", desc: "Go to chrome://extensions in your Chrome browser." },
              { step: "3", title: "Enable Developer Mode", desc: "Toggle 'Developer Mode' on the top right of the Extensions page." },
              { step: "4", title: "Load the extension", desc: "Click 'Load Unpacked' and select the abhilekh-patal-ext folder." },
              { step: "5", title: "Navigate to the archive", desc: "Visit abhilekh.nationalarchives.gov.in and use the extension for one-click downloads." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="labs-install-step">
                <span className="labs-step-num">{step}</span>
                <div>
                  <strong className="labs-step-title">{title}</strong>
                  <p className="labs-step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
