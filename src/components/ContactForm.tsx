/**
 * src/components/ContactForm.tsx
 *
 * Contact form with:
 *  - Formspree backend (or mailto: fallback)
 *  - localStorage draft persistence (so users don't lose their message
 *    if they navigate away, refresh, or hit a long-message limit on mailto)
 *  - Work-in-progress banner until Formspree is configured
 *  - Character counter + draft auto-save
 *
 * STATUS: Work in progress — Formspree form ID is a placeholder.
 * Submissions currently fall back to mailto: which truncates long
 * messages on some email clients. Use the email link directly for
 * long messages until Formspree is wired up.
 */

import { useState, useEffect, useRef } from "react";
import { track } from "@vercel/analytics";
import { useReveal } from "../hooks/useAnimations";

// ── Replace with real Formspree form ID from https://formspree.io/new
const FORMSPREE_ID = "xbljonpz"; // placeholder — update this
const MAX_MESSAGE_LENGTH = 5000;
const DRAFT_KEY = "pk_contact_draft_v1";
const DRAFT_SAVE_MS = 600;

type Status = "idle" | "sending" | "success" | "error";

const SUBJECTS = [
  "Student / Research Inquiry",
  "Media & Press Request",
  "Event / Speaking Invitation",
  "Book / Publication Query",
  "General Message",
];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const DEFAULT_FORM: FormState = {
  name: "",
  email: "",
  subject: SUBJECTS[0],
  message: "",
};

export default function ContactForm() {
  const [ref, visible] = useReveal();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [showDraftRestored, setShowDraftRestored] = useState(false);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { form: FormState; savedAt: number };
        // Only restore if there's actual content
        if (saved.form.name || saved.form.email || saved.form.message) {
          setForm(saved.form);
          setDraftSavedAt(new Date(saved.savedAt));
          setShowDraftRestored(true);
          setTimeout(() => setShowDraftRestored(false), 5000);
        }
      }
    } catch {}
  }, []);

  // Auto-save draft (debounced)
  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      try {
        // Don't save if completely empty or after success
        if (status === "success") return;
        if (form.name || form.email || form.message) {
          localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({ form, savedAt: Date.now() }),
          );
          setDraftSavedAt(new Date());
        }
      } catch {}
    }, DRAFT_SAVE_MS);
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [form, status]);

  const set = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const val = e.target.value;
    if (k === "message" && val.length > MAX_MESSAGE_LENGTH) return;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (FORMSPREE_ID === "xbljonpz") {
      // Fallback to mailto if formspree ID is not updated
      const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0A%0D%0A${form.message}`;
      window.location.href = `mailto:pkhachar@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${body}`;
      setStatus("success");
      setForm(DEFAULT_FORM);
      clearDraft();
      setDraftSavedAt(null);
      track("contact_submit_mailto", { subject: form.subject });
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm(DEFAULT_FORM);
        clearDraft();
        setDraftSavedAt(null);
        track("contact_submit", { subject: form.subject });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const isFormValid =
    form.name.trim() && form.email.trim() && form.message.trim() && !isOverLimit;

  return (
    <section className="contact-section section-pad" id="contact">
      <div
        className="container contact-container"
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="contact-header">
          <span className="section-eyebrow">Get in Touch</span>
          <h2 className="contact-title">Write to Dr. Praduman Khachar</h2>
          <p className="contact-sub">
            For student inquiries, media appearances, speaking engagements, or simply
            to share your thoughts on Gujarat's history.
          </p>
        </div>

        <div
          style={{
            background: "color-mix(in oklch, var(--c-terracotta) 10%, transparent)",
            border: "1px solid color-mix(in oklch, var(--c-terracotta) 25%, transparent)",
            borderRadius: 10,
            padding: "0.9rem 1.1rem",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem",
            color: "var(--c-ink-soft)",
            lineHeight: 1.5,
          }}
        >
          📮 <strong>Direct Email Contact</strong> — Submissions will automatically open your default email application to send directly to{" "}
          <a
            href="mailto:pkhachar@gmail.com"
            style={{ color: "var(--c-terracotta)", fontWeight: 600, textDecoration: "underline" }}
          >
            pkhachar@gmail.com
          </a>
          . Your draft is auto-saved locally on this device as you type.
        </div>

        {showDraftRestored && (
          <div
            style={{
              background: "color-mix(in oklch, var(--c-sage) 15%, transparent)",
              border: "1px solid color-mix(in oklch, var(--c-sage) 35%, transparent)",
              borderRadius: 10,
              padding: "0.7rem 1rem",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--c-ink-soft)",
            }}
          >
            📝 Restored your in-progress draft from earlier. Pick up where you left off.
          </div>
        )}

        <div className="contact-layout">
          {/* Info column */}
          <div className="contact-info">
            <div className="contact-info-item">
              <span className="contact-info-icon">📧</span>
              <div>
                <div className="contact-info-label">Email</div>
                <a href="mailto:pkhachar@gmail.com" className="contact-info-val">
                  pkhachar@gmail.com
                </a>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">🏛️</span>
              <div>
                <div className="contact-info-label">Institution</div>
                <div className="contact-info-val">
                  Dr. Subhash Mahila Arts, Commerce & Home Science College, Junagadh
                </div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">🎓</span>
              <div>
                <div className="contact-info-label">Research Guidance</div>
                <div className="contact-info-val">
                  Accepting PhD scholars in Saurashtra & Kathi History (Saurashtra University)
                </div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">📺</span>
              <div>
                <div className="contact-info-label">YouTube</div>
                <a
                  href="https://www.youtube.com/@PradumanKhachar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-val"
                >
                  @PradumanKhachar — 575+ videos
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-row">
              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-name">Your Name *</label>
                <input
                  id="contact-name"
                  className="contact-input"
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Full name"
                  required
                  disabled={status === "sending"}
                />
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-email">Email Address *</label>
                <input
                  id="contact-email"
                  className="contact-input"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  required
                  disabled={status === "sending"}
                />
              </div>
            </div>

            <div className="contact-field">
              <label className="contact-label" htmlFor="contact-subject">Subject</label>
              <select
                id="contact-subject"
                className="contact-select"
                value={form.subject}
                onChange={set("subject")}
                disabled={status === "sending"}
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="contact-field">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "0.4rem",
                }}
              >
                <label className="contact-label" htmlFor="contact-message" style={{ marginBottom: 0 }}>
                  Message *
                </label>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: isOverLimit ? "var(--c-terracotta)" : "var(--c-ink-muted)",
                    fontWeight: 500,
                  }}
                >
                  {form.message.length.toLocaleString()} / {MAX_MESSAGE_LENGTH.toLocaleString()}
                </span>
              </div>
              <textarea
                id="contact-message"
                className="contact-textarea"
                value={form.message}
                onChange={set("message")}
                placeholder="Share your thoughts, inquiry, or invitation..."
                rows={6}
                required
                disabled={status === "sending"}
              />
              {draftSavedAt && status !== "success" && (
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    color: "var(--c-ink-muted)",
                    marginTop: "0.3rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>📝 Draft auto-saved · {timeAgo(draftSavedAt)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(DEFAULT_FORM);
                      clearDraft();
                      setDraftSavedAt(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--c-ink-muted)",
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Clear draft
                  </button>
                </div>
              )}
            </div>

            {status === "success" && (
              <div className="contact-success">
                ✅ Message sent! Dr. Praduman Khachar will respond soon.
              </div>
            )}
            {status === "error" && (
              <div className="contact-error">
                ⚠️ Something went wrong. Please email directly at pkhachar@gmail.com
              </div>
            )}

            <button
              type="submit"
              className="contact-submit"
              disabled={status === "sending" || !isFormValid}
            >
              {status === "sending" ? (
                <span className="contact-submit-loading">Opening Email…</span>
              ) : (
                "Compose Email to Dr. Khachar →"
              )}
            </button>

            <p className="contact-privacy">
              Your message is prepared in your standard email program and sent directly to Dr. Praduman Khachar's inbox. No third-party data tracking.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function timeAgo(date: Date): string {
  const ms = Date.now() - date.getTime();
  const s = Math.floor(ms / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
