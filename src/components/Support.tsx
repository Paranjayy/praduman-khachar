import { useReveal } from "../hooks/useAnimations";
import { track } from "@vercel/analytics";

export default function Support() {
  const [ref, visible] = useReveal();

  const handleClick = (method: string) => {
    track("support_click", { method });
  };

  return (
    <section className="support-section">
      <div className="support-inner" ref={ref}
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease" }}>

        <div className="support-badge">Support the Work</div>
        <h2 className="support-title">
          History shouldn't be behind a paywall.
        </h2>
        <p className="support-sub">
          Dr. Khachar's 575+ videos, research, and articles are — and always will be — free.
          If his work has moved, educated, or inspired you, consider supporting the mission.
        </p>

        <div className="support-options">
          {/* Ko-fi style — to be updated with real UPI/Patreon link */}
          <a
            href="https://ko-fi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="support-btn support-btn--primary"
            onClick={() => handleClick("kofi")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            Buy a coffee
          </a>

          <a
            href="upi://pay?pa=praduman@upi&pn=Praduman%20Khachar&cu=INR"
            className="support-btn support-btn--secondary"
            onClick={() => handleClick("upi")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
            UPI / GPay
          </a>

          <a
            href="https://patreon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="support-btn support-btn--outline"
            onClick={() => handleClick("patreon")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="14.5" cy="9.5" r="6.5"/><rect x="0" y="0" width="4" height="24"/>
            </svg>
            Become a patron
          </a>
        </div>

        <p className="support-note">
          All proceeds support ongoing research, historical expeditions, and new video production.
          <br />
          <em>UPI and Patreon links to be updated by the family.</em>
        </p>
      </div>
    </section>
  );
}
