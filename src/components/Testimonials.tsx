import { useReveal } from "../hooks/useAnimations";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  source?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Dr. Khachar's scholarship on Saurashtra's Kathi clans is unparalleled. His books are the first reference for anyone serious about regional Indian history.",
    author: "Academic Peer",
    role: "Historian, Gujarat University",
  },
  {
    quote:
      "His books have been found useful in as many as 11 different types of disputes and legal battles — that speaks to the authority and precision of his historical documentation.",
    author: "Gujarat Courts & Government Offices",
    role: "Case Documentation",
  },
  {
    quote:
      "As a PhD guide, Dr. Khachar has a rare ability to nurture original thinking while keeping research grounded in primary sources.",
    author: "Research Scholar",
    role: "PhD Student, Saurashtra University",
  },
  {
    quote:
      "The Library of Congress selecting 23 of his 33 books is extraordinary. It places him among the most significant regional historians of independent India.",
    author: "Library of Congress",
    role: "South Asia Collection",
  },
];

export default function Testimonials() {
  const [ref, visible] = useReveal();

  return (
    <section className="section testimonials-section">
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
        <p className="section-label">Recognition</p>
        <h2 className="section-title">What They Say</h2>
        <div className="section-divider" />
      </div>

      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={i} {...t} index={i} />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  index,
}: Testimonial & { index: number }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="testimonial-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ${index * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="testimonial-quote-mark">"</div>
      <p className="testimonial-text">{quote}</p>
      <footer className="testimonial-footer">
        <span className="testimonial-author">{author}</span>
        <span className="testimonial-role">{role}</span>
      </footer>
    </div>
  );
}
