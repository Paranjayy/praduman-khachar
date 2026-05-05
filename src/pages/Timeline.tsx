import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { BOOKS } from "../data/content";

const MILESTONES = [
  { year: "1960s", event: "Early research into Saurashtra's princely states and tribal history." },
  { year: "1980s", event: "Academic tenure and beginning of formal archival collection." },
  { year: "1997", event: "Publication of 'History of Porbandar', a seminal work." },
  { year: "2005", event: "Selected for the Library of Congress international acquisition program." },
  { year: "2012", event: "Launch of YouTube Archival project to digitize oral histories." },
  { year: "2018", event: "Reached 100,000 research hours in archives across India." },
  { year: "2023", event: "Legacy project: Digital Archive of 575+ Historical Video Essays." },
];

export default function TimelinePage() {
  usePageTitle("Heritage Timeline");

  return (
    <div className="timeline-page">
      <PageHeader 
        eyebrow="Chronicle of Research"
        title="Heritage Timeline"
        subtitle="A journey through decades of archival discovery and historical preservation."
      />

      <main className="section timeline-container">
        <div className="timeline-line" />
        
        <div className="timeline-items">
          {MILESTONES.map((m, i) => (
            <motion.div 
              key={m.year}
              className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-year">{m.year}</div>
                <p className="timeline-event">{m.event}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="timeline-books-milestones">
          <h2 className="timeline-sub-title">Major Publications</h2>
          <div className="timeline-grid">
            {BOOKS.filter(b => b.year).sort((a,b) => parseInt(a.year || "0") - parseInt(b.year || "0")).map((b, i) => (
              <motion.div 
                key={b.title}
                className="timeline-book-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="timeline-book-year">{b.year}</div>
                <div className="timeline-book-title">{b.title}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
