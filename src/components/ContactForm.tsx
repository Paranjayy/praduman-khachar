/**
 * src/components/ContactForm.tsx
 *
 * Functional contact form using Formspree (free tier, no backend).
 * Subjects: Student inquiry, Media request, Event invitation, General.
 *
 * ACTION: Replace FORMSPREE_ID with real ID from formspree.io/new
 */

import { useState } from "react";
import { track } from "@vercel/analytics";
import { useReveal } from "../hooks/useAnimations";

// ── Replace with real Formspree form ID from https://formspree.io/new
const FORMSPREE_ID = "xbljonpz"; // placeholder — update this

type Status = "idle" | "sending" | "success" | "error";

const SUBJECTS = [
  "Student / Research Inquiry",
  "Media & Press Request",
  "Event / Speaking Invitation",
  "Book / Publication Query",
  "General Message",
];

export default function ContactForm() {
  const [ref, visible] = useReveal();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (FORMSPREE_ID === "xbljonpz") {
      // Fallback to mailto if formspree ID is not updated
      const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0A%0D%0A${form.message}`;
      window.location.href = `mailto:pkhachar@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${body}`;
      setStatus("success");
      setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
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
        setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
        track("contact_submit", { subject: form.subject });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="contact-section section-pad" id="contact">
      <div
        ref={ref}
        className="contact-inner"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.7s ease",
        }}
      >
        <div className="contact-header">
          <span className="section-eyebrow">Get in Touch</span>
          <h2 className="contact-title">Write to Dr. Khachar</h2>
          <p className="contact-sub">
            For student inquiries, media appearances, speaking engagements, or simply
            to share your thoughts on Gujarat's history.
          </p>
        </div>

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
              <label className="contact-label" htmlFor="contact-message">Message *</label>
              <textarea
                id="contact-message"
                className="contact-textarea"
                value={form.message}
                onChange={set("message")}
                placeholder="Share your thoughts, inquiry, or invitation..."
                rows={5}
                required
                disabled={status === "sending"}
              />
            </div>

            {status === "success" && (
              <div className="contact-success">
                ✅ Message sent! Dr. Khachar will respond soon.
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
              disabled={status === "sending" || !form.name || !form.email || !form.message}
            >
              {status === "sending" ? (
                <span className="contact-submit-loading">Sending…</span>
              ) : (
                "Send Message →"
              )}
            </button>

            <p className="contact-privacy">
              Your message goes directly to Dr. Khachar's inbox. No spam, no third parties.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
