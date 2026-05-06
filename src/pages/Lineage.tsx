import { motion } from "framer-motion";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";

const TREE_DATA = {
  name: "Kathiawar Dynasties",
  children: [
    {
      name: "Junagadh",
      children: [
        { name: "Babi Dynasty" },
        { name: "Nawab of Junagadh" }
      ]
    },
    {
      name: "Bhavnagar",
      children: [
        { name: "Gohil Dynasty" },
        { name: "Sihor Branch" }
      ]
    },
    {
      name: "Gondal",
      children: [
        { name: "Jadeja Dynasty" },
        { name: "Sangramji I" }
      ]
    }
  ]
};

export default function LineagePage() {
  usePageTitle("Dynastic Lineages");
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <main className="page-content">
      <PageHeader
        label="Scholarly Visualization"
        title="Dynastic Lineages"
        subtitle="Animated genealogical mapping of Saurashtra's ruling houses, inspired by Manim's mathematical precision."
      />

      <section className="section lineage-section">
        <div className="lineage-canvas">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lineage-root"
          >
            <div className="lineage-node root">{TREE_DATA.name}</div>
            
            <div className="lineage-branches">
              {TREE_DATA.children.map((child, i) => (
                <div key={child.name} className="lineage-branch-group">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="lineage-line-vertical"
                  />
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`lineage-node parent ${activeNode === child.name ? 'active' : ''}`}
                    onMouseEnter={() => setActiveNode(child.name)}
                  >
                    {child.name}
                  </motion.div>
                  
                  <div className="lineage-sub-branches">
                    {child.children.map((sub, j) => (
                      <motion.div 
                        key={sub.name}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 + j * 0.05 }}
                        className="lineage-node child"
                      >
                        {sub.name}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lineage-sidebar">
          <div className="lineage-info-card">
            <h3>Archival Context</h3>
            <p>Dr. Khachar's research extensively documents the transition of these dynasties from sovereign states to the Union of India.</p>
            <div className="lineage-meta">
              <span>Source: "Saurashtrano Itihas"</span>
              <span>Videos: 12+</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .lineage-section {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 3rem;
          min-height: 500px;
        }
        .lineage-canvas {
          background: var(--c-parchment-deep);
          border-radius: 12px;
          padding: 4rem;
          border: 1px solid var(--c-border);
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
        }
        .lineage-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        .lineage-node {
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-family: var(--font-display);
          font-size: 1.1rem;
          border: 1px solid var(--c-border);
          background: var(--c-parchment);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s;
          cursor: pointer;
        }
        .lineage-node.root {
          background: var(--c-ink);
          color: white;
          font-size: 1.4rem;
          padding: 1rem 2rem;
        }
        .lineage-node.parent {
          font-weight: 600;
          border-left: 4px solid var(--c-terracotta);
        }
        .lineage-node.parent.active {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          border-color: var(--c-gold);
        }
        .lineage-node.child {
          font-size: 0.9rem;
          color: var(--c-ink-soft);
          background: rgba(255,255,255,0.5);
        }
        .lineage-branches {
          display: flex;
          gap: 3rem;
        }
        .lineage-branch-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          position: relative;
        }
        .lineage-line-vertical {
          width: 2px;
          height: 30px;
          background: var(--c-border);
        }
        .lineage-sub-branches {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-top: 1rem;
        }
        .lineage-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .lineage-info-card {
          padding: 2rem;
          background: var(--c-parchment);
          border-radius: 12px;
          border: 1px solid var(--c-border);
        }
        .lineage-info-card h3 {
          margin-bottom: 1rem;
          font-family: var(--font-display);
        }
        .lineage-info-card p {
          font-size: 0.95rem;
          color: var(--c-ink-soft);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .lineage-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.8rem;
          opacity: 0.6;
        }
      `}</style>
    </main>
  );
}
