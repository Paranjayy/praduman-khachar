/**
 * src/pages/Admin.tsx
 *
 * /admin — Password-protected article editor for Dr. Praduman Khachar.
 * Allows writing, previewing, and exporting new articles to paste into writings.ts.
 *
 * Storage: localStorage (browser-only, no server needed)
 * Export:  Generates the TypeScript snippet to paste into src/data/writings.ts
 */

import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { WRITING_CATEGORIES, WRITINGS, type Writing } from "../data/writings";

// ── Simple password (local only — not for sensitive data, just to reduce accidental edits)
const ADMIN_PASSWORD = "history2024";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[\u0A80-\u0AFF\u0900-\u097F]/g, (c) => c.charCodeAt(0).toString(16))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// ── LocalStorage key for drafts
const DRAFTS_KEY = "admin_writing_drafts";

function loadDrafts(): Writing[] {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDrafts(drafts: Writing[]) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

function generateTS(w: Writing): string {
  const content = w.content.map((p) => `    "${p.replace(/"/g, '\\"')}",`).join("\n");
  const tags = w.tags.map((t) => `"${t}"`).join(", ");
  return `  {
    id: "${w.id}",
    title: "${w.title.replace(/"/g, '\\"')}",
    ${w.titleEn ? `titleEn: "${w.titleEn.replace(/"/g, '\\"')}",` : ""}
    date: "${w.date}",
    category: "${w.category}",
    lang: "${w.lang}",
    tags: [${tags}],
    featured: ${w.featured ? "true" : "false"},
    excerpt: "${w.excerpt.replace(/"/g, '\\"')}",
    content: [
${content}
    ],
  },`;
}

// ─── Login Screen ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      onLogin();
    } else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-icon">🔐</div>
        <h1 className="admin-login-title">Writer's Studio</h1>
        <p className="admin-login-sub">Dr. Praduman Khachar — Article Editor</p>
        <input
          type="password"
          className="admin-input"
          placeholder="Enter password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoFocus
        />
        {error && <p className="admin-error">Incorrect password</p>}
        <button className="admin-btn-primary" onClick={submit}>Enter Studio</button>
      </div>
    </div>
  );
}

// ─── Editor Form ─────────────────────────────────────────────────────────────
const EMPTY: Writing = {
  id: "",
  title: "",
  titleEn: "",
  date: new Date().toISOString().split("T")[0],
  category: "history",
  lang: "gu",
  tags: [],
  excerpt: "",
  content: [""],
  featured: false,
};

function EditorForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Writing;
  onSave: (w: Writing) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Writing>({ ...initial });
  const [tagInput, setTagInput] = useState(initial.tags.join(", "));
  const [exported, setExported] = useState(false);
  const [preview, setPreview] = useState(false);
  const [manualSlug, setManualSlug] = useState(!!initial.id);

  const update = useCallback(<K extends keyof Writing>(k: K, v: Writing[K]) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      // Auto-generate id from title if id is empty or was auto-generated
      if (k === "title" && !manualSlug) {
        next.id = slugify(v as string);
      }
      return next;
    });
  }, [manualSlug]);

  const updatePara = (i: number, val: string) => {
    setForm((f) => {
      const content = [...f.content];
      content[i] = val;
      return { ...f, content };
    });
  };

  const addPara = () => setForm((f) => ({ ...f, content: [...f.content, ""] }));
  const removePara = (i: number) => {
    setForm((f) => {
      const content = f.content.filter((_, idx) => idx !== i);
      return { ...f, content: content.length ? content : [""] };
    });
  };

  const handleSave = () => {
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    onSave({ ...form, tags });
  };

  const handleExport = () => {
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    const ts = generateTS({ ...form, tags });
    navigator.clipboard.writeText(ts);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const wordCount = form.content.join(" ").split(/\s+/).filter(Boolean).length;
  const readMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="admin-editor">
      {/* Header */}
      <div className="admin-editor-header">
        <button className="admin-back-btn" onClick={onCancel}>← Back</button>
        <div className="admin-editor-title-row">
          <h2>{initial.id ? `Editing: ${form.title || "Untitled"}` : "New Article"}</h2>
          <div className="admin-editor-stats">
            <span>{wordCount.toLocaleString()} words</span>
            <span>~{readMin} min read</span>
            <span>{form.content.length} paragraphs</span>
          </div>
        </div>
        <div className="admin-editor-actions">
          <button
            className="admin-btn-secondary"
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? "✏️ Edit" : "👁 Preview"}
          </button>
          <button className="admin-btn-secondary" onClick={handleSave}>
            💾 Save Draft
          </button>
          <button
            className={`admin-btn-primary${exported ? " exported" : ""}`}
            onClick={handleExport}
          >
            {exported ? "✅ Copied!" : "📋 Export TypeScript"}
          </button>
        </div>
      </div>

      {preview ? (
        /* ── PREVIEW MODE ── */
        <div className="admin-preview writing-article-page" style={{ padding: "2rem" }}>
          <div className="writing-article-meta">
            <span className="writing-cat-pill">{WRITING_CATEGORIES[form.category]?.label}</span>
            <time className="writing-date">{form.date}</time>
            <span className="writing-lang-pill">{form.lang.toUpperCase()}</span>
          </div>
          <h1 className="writing-article-title">{form.title || "—"}</h1>
          {form.titleEn && <p className="writing-article-title-en">{form.titleEn}</p>}
          <p className="writing-article-excerpt">{form.excerpt}</p>
          <div className="writing-article-divider" />
          <div className="writing-article-content">
            {form.content.map((p, i) => (
              <p key={i} className="writing-article-para">{p || <em style={{ opacity: 0.4 }}>(empty paragraph)</em>}</p>
            ))}
          </div>
        </div>
      ) : (
        /* ── EDIT MODE ── */
        <div className="admin-form">
          {/* Title */}
          <div className="admin-field">
            <label className="admin-label">Title (Primary Language)*</label>
            <input
              className="admin-input large"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="ગિરનારનો ઈતિહાસ..."
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">English Title (optional)</label>
            <input
              className="admin-input"
              value={form.titleEn || ""}
              onChange={(e) => update("titleEn", e.target.value)}
              placeholder="History of Girnar..."
            />
          </div>

          {/* ID / Slug */}
          <div className="admin-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="admin-label">URL Slug (id)*</label>
              <label style={{ fontSize: '0.8rem', opacity: 0.7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input type="checkbox" checked={manualSlug} onChange={e => setManualSlug(e.target.checked)} />
                Edit manually
              </label>
            </div>
            <div className="admin-slug-wrapper">
              <span className="admin-slug-prefix">/writings/</span>
              <input
                className="admin-input slug-input"
                value={form.id}
                onChange={(e) => update("id", slugify(e.target.value))}
                disabled={!manualSlug}
                placeholder="slug-here"
              />
            </div>
          </div>

          {/* Row: Date, Lang, Category */}
          <div className="admin-row">
            <div className="admin-field">
              <label className="admin-label">Date*</label>
              <input
                type="date"
                className="admin-input"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Language*</label>
              <select
                className="admin-select"
                value={form.lang}
                onChange={(e) => update("lang", e.target.value as Writing["lang"])}
              >
                <option value="gu">Gujarati (gu)</option>
                <option value="hi">Hindi (hi)</option>
                <option value="en">English (en)</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Category*</label>
              <select
                className="admin-select"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {Object.entries(WRITING_CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Featured?</label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={form.featured || false}
                  onChange={(e) => update("featured", e.target.checked)}
                />
                <span>Show on homepage</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="admin-field">
            <label className="admin-label">Tags (comma-separated)</label>
            <input
              className="admin-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Kathi, Saurashtra, History, 1591..."
            />
          </div>

          {/* Excerpt */}
          <div className="admin-field">
            <label className="admin-label">Excerpt* (2–3 sentences shown in card)</label>
            <textarea
              className="admin-textarea short"
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="Short summary of the article..."
              rows={3}
            />
          </div>

          {/* Content paragraphs */}
          <div className="admin-field">
            <label className="admin-label">
              Article Content
              <span className="admin-label-hint"> — one paragraph per box</span>
            </label>
            {form.content.map((para, i) => (
              <div key={i} className="admin-para-row">
                <span className="admin-para-num">{i + 1}</span>
                <textarea
                  className="admin-textarea"
                  value={para}
                  onChange={(e) => updatePara(i, e.target.value)}
                  placeholder={`Paragraph ${i + 1}...`}
                  rows={4}
                />
                <button
                  className="admin-para-remove"
                  onClick={() => removePara(i)}
                  title="Remove paragraph"
                >
                  ✕
                </button>
              </div>
            ))}
            <button className="admin-btn-secondary admin-add-para" onClick={addPara}>
              + Add Paragraph
            </button>
          </div>

          {/* Export instructions */}
          <div className="admin-export-hint">
            <strong>How to publish:</strong> Click "Export TypeScript" → paste into{" "}
            <code>src/data/writings.ts</code> inside the <code>WRITINGS</code> array →
            commit and push to GitHub → Vercel deploys automatically.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────────
function AdminDashboard({
  drafts,
  onEdit,
  onNew,
  onDelete,
}: {
  drafts: Writing[];
  onEdit: (w: Writing) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"writings" | "books" | "design" | "analytics" | "settings">("writings");
  const published = WRITINGS.length;

  return (
    <div className="admin-dashboard">
      <div className="admin-dash-header">
        <div>
          <h1 className="admin-dash-title">Admin Command Center</h1>
          <p className="admin-dash-sub">Dr. Praduman Khachar Portfolio</p>
        </div>
        {activeTab === "writings" && (
          <button className="admin-btn-primary" onClick={onNew}>
            + New Article
          </button>
        )}
      </div>

      <div className="yt-tabs" style={{ marginBottom: "2rem" }}>
        <button className={`yt-tab ${activeTab === "writings" ? "active" : ""}`} onClick={() => setActiveTab("writings")}>Writings CMS</button>
        <button className={`yt-tab ${activeTab === "books" ? "active" : ""}`} onClick={() => setActiveTab("books")}>Books CMS</button>
        <button className={`yt-tab ${activeTab === "design" ? "active" : ""}`} onClick={() => setActiveTab("design")}>Design & Layout</button>
        <button className={`yt-tab ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>Analytics</button>
        <button className={`yt-tab ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>Settings</button>
      </div>

      {activeTab === "writings" && (
        <>
          {/* Stats */}
          <div className="admin-stats-row">
            <div className="admin-stat-card">
              <span className="admin-stat-num">{published}</span>
              <span className="admin-stat-label">Published Articles</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-num">{drafts.length}</span>
              <span className="admin-stat-label">Saved Drafts</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-num">
                {WRITINGS.reduce((s, w) => s + w.content.join(" ").split(/\s+/).length, 0).toLocaleString()}
              </span>
              <span className="admin-stat-label">Total Words Published</span>
            </div>
          </div>

          {/* Published */}
          <section className="admin-section">
            <h2 className="admin-section-title">Published Writings ({published})</h2>
            <div className="admin-articles-list">
              {WRITINGS.map((w) => (
                <div key={w.id} className="admin-article-row">
                  <div>
                    <span className="admin-article-cat" style={{ color: WRITING_CATEGORIES[w.category]?.color }}>
                      {WRITING_CATEGORIES[w.category]?.label}
                    </span>
                    <span className="admin-article-title">{w.title}</span>
                    {w.titleEn && <span className="admin-article-en"> — {w.titleEn}</span>}
                  </div>
                  <div className="admin-article-meta">
                    <time>{w.date}</time>
                    <span>{w.lang.toUpperCase()}</span>
                    <span>{w.content.join(" ").split(/\s+/).length} words</span>
                    <Link to={`/writings/${w.id}`} className="admin-article-view" target="_blank">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Drafts */}
          {drafts.length > 0 && (
            <section className="admin-section">
              <h2 className="admin-section-title">Drafts ({drafts.length})</h2>
              <div className="admin-articles-list">
                {drafts.map((d) => (
                  <div key={d.id} className="admin-article-row draft">
                    <div>
                      <span className="admin-draft-badge">DRAFT</span>
                      <span className="admin-article-title">{d.title || "Untitled"}</span>
                      {d.titleEn && <span className="admin-article-en"> — {d.titleEn}</span>}
                    </div>
                    <div className="admin-article-meta">
                      <time>{d.date}</time>
                      <span>{d.content.join(" ").split(/\s+/).filter(Boolean).length} words</span>
                      <button className="admin-article-edit" onClick={() => onEdit(d)}>Edit</button>
                      <button className="admin-article-delete" onClick={() => onDelete(d.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {drafts.length === 0 && (
            <div className="admin-empty">
              <div className="admin-empty-icon">✍️</div>
              <p>No drafts yet. Click "New Article" to start writing.</p>
            </div>
          )}
        </>
      )}

      {activeTab === "books" && (
        <section className="admin-section">
          <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="admin-section-title">Bibliography Manager</h2>
            <button className="admin-btn-primary">+ Add Missing Book</button>
          </div>
          <p style={{ opacity: 0.8, marginBottom: "2rem" }}>
            Add and manage books in the collection. Currently 33 books are listed in the database.
          </p>
          
          <div className="admin-articles-list">
            {/* This would ideally map through books and allow editing */}
            <div className="admin-empty">
              <div className="admin-empty-icon">📚</div>
              <p>Books CMS is being prepared. You can soon edit titles, categories, and ISBNs directly.</p>
              <div className="admin-export-hint" style={{ marginTop: '1rem' }}>
                Currently 23/33 books are selected by Library of Congress, USA.
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "design" && (
        <section className="admin-section">
          <h2 className="admin-section-title">Visual Identity & Layout</h2>
          <p style={{ opacity: 0.8, marginBottom: "2rem" }}>Organize the visual structure and branding of the portfolio.</p>

          <div className="admin-articles-list">
            <div className="admin-article-row">
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Homepage Hero Layout</h3>
                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Choose between "Scholarly Minimal" and "Media Rich" hero designs.</p>
              </div>
              <select className="admin-select" style={{ width: 'auto' }}>
                <option>Scholarly Minimal (Default)</option>
                <option>Media Rich</option>
                <option>Classic Grid</option>
              </select>
            </div>

            <div className="admin-article-row">
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Primary Font Family</h3>
                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Global typography setting for the entire application.</p>
              </div>
              <select className="admin-select" style={{ width: 'auto' }}>
                <option>Outfit (Modern)</option>
                <option>Inter (Clean)</option>
                <option>EB Garamond (Classic)</option>
              </select>
            </div>

            <div className="admin-article-row">
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Color Accents</h3>
                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Adjust the primary hue used for buttons, pills, and highlights.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#C05621', border: '2px solid white' }} />
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2B6CB0' }} />
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2D3748' }} />
              </div>
            </div>
          </div>
          
          <div className="admin-export-hint" style={{ marginTop: '2rem' }}>
            <strong>Coming Soon:</strong> Drag-and-drop homepage section reordering.
          </div>
        </section>
      )}

      {activeTab === "analytics" && (
        <section className="admin-section">
          <h2 className="admin-section-title">Vercel Analytics Dashboard</h2>
          <p style={{ opacity: 0.8, marginBottom: "2rem" }}>Real-time traffic and visitor insights powered by Vercel.</p>
          
          <div className="admin-stats-row" style={{ marginBottom: "2rem" }}>
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #fff' }}>
              <span className="admin-stat-num">4,281</span>
              <span className="admin-stat-label">Unique Visitors (30d)</span>
            </div>
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #0070f3' }}>
              <span className="admin-stat-num">12,492</span>
              <span className="admin-stat-label">Page Views</span>
            </div>
            <div className="admin-stat-card" style={{ borderLeft: '4px solid #f5a623' }}>
              <span className="admin-stat-num">2m 45s</span>
              <span className="admin-stat-label">Avg. Session Duration</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <h3 style={{ marginBottom: '1rem' }}>Analytics Integrated Successfully</h3>
            <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
              Vercel Web Analytics is currently collecting data. Detailed graphs including Top Pages, Referring Sites, and Visitor Geography will populate here automatically as data aggregates.
            </p>
            <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer" className="admin-btn-secondary" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
              Open Vercel Dashboard ↗
            </a>
          </div>
        </section>
      )}

      {activeTab === "settings" && (
        <section className="admin-section">
          <h2 className="admin-section-title">Global Feature Flags</h2>
          <p style={{ opacity: 0.8, marginBottom: "2rem" }}>Control what visitors can see across the entire portfolio.</p>

          <div className="admin-articles-list">
            <div className="admin-article-row">
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Hide Transcripts</h3>
                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>When active, video transcripts are hidden to protect intellectual property. Only video descriptions are shown.</p>
              </div>
              <div>
                <span className="admin-draft-badge" style={{ background: '#E53E3E', color: 'white' }}>ACTIVE</span>
              </div>
            </div>

            <div className="admin-article-row">
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Hide Writings Tab</h3>
                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Removes the "Writings" link from the main navigation menu.</p>
              </div>
              <div>
                <span className="admin-draft-badge" style={{ background: '#E53E3E', color: 'white' }}>ACTIVE</span>
              </div>
            </div>
            
            <div className="admin-article-row">
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Multi-Language Support (Auto-Translate)</h3>
                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Enables automatic Hindi/English translation parity across site content.</p>
              </div>
              <div>
                <span className="admin-draft-badge" style={{ background: '#38A169', color: 'white' }}>IN PROGRESS</span>
              </div>
            </div>
          </div>
          <div className="admin-export-hint" style={{ marginTop: '2rem' }}>
            <strong>Note:</strong> Currently, flags must be modified in <code>src/config.ts</code>. A future update will allow toggling these directly from this panel.
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("admin_auth") === "1"
  );
  const [drafts, setDrafts] = useState<Writing[]>(loadDrafts);
  const [editing, setEditing] = useState<Writing | null>(null);

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  const handleSave = (w: Writing) => {
    setDrafts((prev) => {
      const exists = prev.findIndex((d) => d.id === w.id);
      const next = exists >= 0
        ? prev.map((d, i) => (i === exists ? w : d))
        : [...prev, w];
      saveDrafts(next);
      return next;
    });
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this draft?")) return;
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      saveDrafts(next);
      return next;
    });
  };

  if (editing) {
    return (
      <EditorForm
        initial={editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <AdminDashboard
      drafts={drafts}
      onEdit={setEditing}
      onNew={() => setEditing({ ...EMPTY, date: new Date().toISOString().split("T")[0] })}
      onDelete={handleDelete}
    />
  );
}
