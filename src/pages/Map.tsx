import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { Link } from "react-router-dom";

const LOCATIONS = [
  { name: "Junagadh", x: 450, y: 350, keywords: ["Junagadh", "Girnar", "Bhavnath", "Narsinh Mehta", "Uparkot"] },
  { name: "Somnath", x: 420, y: 550, keywords: ["Somnath", "Prabhas Patan", "Patan", "Veraval"] },
  { name: "Porbandar", x: 150, y: 380, keywords: ["Porbandar", "Gandhi", "Kirti Mandir"] },
  { name: "Bhavnagar", x: 750, y: 320, keywords: ["Bhavnagar", "Gohilwad", "Palitana", "Sihor"] },
  { name: "Rajkot", x: 500, y: 220, keywords: ["Rajkot", "Saurashtra University"] },
  { name: "Gondal", x: 520, y: 300, keywords: ["Gondal", "Sangramji"] },
  { name: "Morbi", x: 400, y: 120, keywords: ["Morbi"] },
  { name: "Jamnagar", x: 250, y: 180, keywords: ["Jamnagar", "Halar", "Nawanagar"] },
  { name: "Amreli", x: 650, y: 380, keywords: ["Amreli", "Lathi", "Kalaapi"] },
  { name: "Dwarka", x: 50, y: 220, keywords: ["Dwarka", "Okhamandal"] },
];

export default function MapPage() {
  usePageTitle("Archival Map");
  const [selectedLoc, setSelectedLoc] = useState<typeof LOCATIONS[0] | null>(null);

  return (
    <div className="map-page">
      <PageHeader 
        eyebrow="Geographic Intelligence"
        title="Archival Map of Saurashtra"
        subtitle="Exploring historical records across the 222 states of the Kathiawar peninsula."
      />

      <main className="section map-container">
        <div className="map-layout">
          <div className="map-visual-wrap">
            <svg viewBox="0 0 1000 700" className="saurashtra-svg">
               {/* Very simplified Saurashtra outline */}
               <path d="M 100 100 Q 200 50 400 80 Q 600 50 800 100 Q 950 200 900 400 Q 800 600 500 650 Q 200 600 50 400 Q 0 200 100 100" fill="rgba(226,106,75,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
               
               {LOCATIONS.map(loc => (
                 <g key={loc.name} onClick={() => setSelectedLoc(loc)} style={{ cursor: 'pointer' }}>
                    <motion.circle
                      cx={loc.x} cy={loc.y} r={8}
                      fill={selectedLoc?.name === loc.name ? "var(--c-terracotta)" : "rgba(255,255,255,0.4)"}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.5 }}
                    />
                    <motion.text
                      x={loc.x + 15} y={loc.y + 5}
                      fill={selectedLoc?.name === loc.name ? "#fff" : "rgba(255,255,255,0.3)"}
                      fontSize="14"
                      fontFamily="var(--font-sans)"
                      fontWeight="700"
                    >
                      {loc.name}
                    </motion.text>
                 </g>
               ))}
            </svg>
          </div>

          <aside className="map-sidebar">
             {selectedLoc ? (
               <motion.div 
                 key={selectedLoc.name}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="map-loc-detail"
               >
                  <h2 className="map-loc-title">{selectedLoc.name}</h2>
                  <p className="map-loc-desc">Archival research covers {selectedLoc.keywords.length} major topics in this region.</p>
                  <div className="map-loc-keywords">
                    {selectedLoc.keywords.map(k => <span key={k} className="map-keyword">{k}</span>)}
                  </div>
                  <Link to={`/explore?q=${selectedLoc.name}`} className="map-loc-btn">
                     Explore {selectedLoc.name} Records →
                  </Link>
               </motion.div>
             ) : (
               <div className="map-empty-state">
                  <p>Select a location on the map to discover archival records and video essays related to that region.</p>
               </div>
             )}
          </aside>
        </div>
      </main>
    </div>
  );
}
