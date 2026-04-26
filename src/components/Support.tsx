import { useReveal } from "../hooks/useAnimations";
import { track } from "@vercel/analytics";

/* ─────────────────────────────────────────────────────────────
 * ACTION REQUIRED:
 *  Update the href values below with real links:
 *  - UPI_LINK: upi://pay?pa=YOUR_UPI_ID&pn=Praduman%20Khachar&cu=INR
 *  - RAZORPAY_LINK: your Razorpay payment page URL
 *  - PATREON_LINK: patreon.com/yourpage
 * ─────────────────────────────────────────────────────────────*/
const UPI_LINK = "upi://pay?pa=pkhachar@oksbi&pn=Praduman%20Khachar&cu=INR&am=100";
const RAZORPAY_LINK = "#"; // Replace with actual Razorpay payment page
const PATREON_LINK = "#";  // Replace with Patreon URL if created later

const WAYS = [
  {
    id: "upi",
    label: "UPI / GPay",
    sub: "Instant. No account needed.",
    href: UPI_LINK,
    icon: (
      <svg width="20" height="20" viewBox="0 0 80 80" fill="none">
        <rect width="80" height="80" rx="12" fill="transparent"/>
        <path d="M40 8L14 22v36l26 14 26-14V22L40 8z" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path d="M28 40h24M40 28v24" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    badge: "🇮🇳 Indian",
  },
  {
    id: "razorpay",
    label: "Pay Online",
    sub: "Cards, Net Banking, Wallets",
    href: RAZORPAY_LINK,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
      </svg>
    ),
    badge: null,
  },
  {
    id: "patreon",
    label: "Patreon",
    sub: "Monthly membership",
    href: PATREON_LINK,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="14.5" cy="9.5" r="6.5"/>
        <rect x="0" y="0" width="4" height="24"/>
      </svg>
    ),
    badge: null,
  },
];

export default function Support() {
  const [ref, visible] = useReveal();

  return (
    <section className="support-section">
      <div
        ref={ref}
        className="support-inner"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.7s ease",
        }}
      >
        <div className="support-badge">Support the Work</div>
        <h2 className="support-title">
          History shouldn't be behind a paywall.
        </h2>
        <p className="support-sub">
          Dr. Khachar's 575+ videos, research, and writing are — and always will be — free.
          If his work has moved, educated, or inspired you, consider supporting
          the mission of preserving Saurashtra's heritage.
        </p>

        <div className="support-options">
          {WAYS.map((w) => (
            <a
              key={w.id}
              href={w.href}
              target={w.href.startsWith("upi:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={`support-way`}
              onClick={() => track("support_click", { method: w.id })}
            >
              <span className="support-way-icon">{w.icon}</span>
              <span className="support-way-text">
                <strong>{w.label}</strong>
                <small>{w.sub}</small>
              </span>
              {w.badge && <span className="support-way-badge">{w.badge}</span>}
            </a>
          ))}
        </div>

        <div className="support-amounts">
          {["₹51", "₹101", "₹251", "₹501"].map((amt) => (
            <a
              key={amt}
              href={`upi://pay?pa=pkhachar@oksbi&pn=Praduman%20Khachar&cu=INR&am=${amt.slice(1)}`}
              className="support-amount-pill"
              onClick={() => track("support_click", { method: "upi_quick", amount: amt })}
            >
              {amt}
            </a>
          ))}
        </div>

        <p className="support-note">
          All proceeds support ongoing historical research, field expeditions, and video production.
          <br />
          <em>Update UPI/Razorpay/Patreon links in Support.tsx when ready.</em>
        </p>
      </div>
    </section>
  );
}
