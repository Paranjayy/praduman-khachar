import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

// Fix leaflet icon issue in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LOCATIONS = [
  { name: "Junagadh", lat: 21.5222, lng: 70.4579, keywords: ["Junagadh State", "Girnar", "Bhavnath", "Uparkot Fort", "Nawab of Junagadh", "Ashoka Edicts"] },
  { name: "Somnath", lat: 20.8880, lng: 70.4012, keywords: ["Somnath Temple", "Prabhas Patan", "Triveni Sangam", "Veraval", "Ahilyabai Temple"] },
  { name: "Porbandar", lat: 21.6417, lng: 69.6093, keywords: ["Sudamapuri", "Kirti Mandir", "Mahatma Gandhi", "Huzoor Palace", "Bird Sanctuary"] },
  { name: "Bhavnagar", lat: 21.7645, lng: 72.1519, keywords: ["Gohilwad", "Nilambag Palace", "Takhteshwar", "Alang", "Bhavnagar State"] },
  { name: "Rajkot", lat: 22.3039, lng: 70.8022, keywords: ["Watson Museum", "Rajkumar College", "Alfred High School", "Aji Dam"] },
  { name: "Gondal", lat: 21.9619, lng: 70.7981, keywords: ["Naulakha Palace", "Sangramji High School", "Bhuvaneshwari Temple", "Vintage Car Museum"] },
  { name: "Morbi", lat: 22.8120, lng: 70.8236, keywords: ["Mani Mandir", "Wellington Secretariat", "Art Deco Palace", "Suspension Bridge"] },
  { name: "Jamnagar", lat: 22.4707, lng: 70.0577, keywords: ["Nawanagar", "Lakhota Lake", "Darbargadh", "Khijadiya", "Marine National Park"] },
  { name: "Amreli", lat: 21.6031, lng: 71.2223, keywords: ["Gaekwad State", "Lathi", "Kalaapi Teerth", "Amreli Tower"] },
  { name: "Dwarka", lat: 22.2442, lng: 68.9685, keywords: ["Dwarkadhish Temple", "Bet Dwarka", "Gopi Talav", "Nageshwar Jyotirlinga"] },
  { name: "Palitana", lat: 21.5055, lng: 71.8273, keywords: ["Shatrunjaya Hills", "Jain Temples", "Shetrunji River", "Gohilwad History"] },
  { name: "Wadhwan", lat: 22.7000, lng: 71.6833, keywords: ["Wadhwan State", "Hawa Mahal", "Ancient Stepwells", "Surendranagar"] },
  { name: "Dhrangadhra", lat: 22.9833, lng: 71.4667, keywords: ["Jhala Dynasty", "Desert Sanctuary", "Salt Mines", "Historical Palace"] },
  { name: "Muli", lat: 22.6167, lng: 71.4333, keywords: ["Muli State", "Mandavrayji Temple", "Pramila Raje Palace"] },
  { name: "Wankaner", lat: 22.6167, lng: 70.9333, keywords: ["Ranjit Vilas Palace", "Machhu River", "Wankaner State History"] },
  { name: "Limbdi", lat: 22.5667, lng: 71.8000, keywords: ["Limbdi State", "Digvijay Niwas", "Freedom Struggle"] },
];

function ThemeLayer() {
  const { dark } = useTheme();
  const url = dark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  
  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      url={url}
    />
  );
}

const customIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div class="marker-goo-wrap">
      <div class="marker-pin"></div>
      <div class="marker-pulse"></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

export default function MapPage() {
  usePageTitle("Archival Map");
  const [selectedLoc, setSelectedLoc] = useState<typeof LOCATIONS[0] | null>(null);

  return (
    <div className="map-page">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
      <PageHeader 
        eyebrow="Geographic Intelligence"
        title="Archival Map of Saurashtra"
        subtitle="Exploring historical records across the 222 states of the Kathiawar peninsula."
      />

      <main className="section map-container">
        <div className="map-layout leaflet-enabled">
          <div className="map-visual-wrap">
            <MapContainer 
              center={[21.8, 70.5]} 
              zoom={8} 
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%", borderRadius: "12px", background: "var(--c-parchment-deep)" }}
            >
              <ThemeLayer />
              {LOCATIONS.map(loc => (
                <Marker 
                  key={loc.name} 
                  position={[loc.lat, loc.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedLoc(loc),
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>{loc.name}</h3>
                      <p>{loc.keywords.slice(0, 3).join(", ")}...</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <aside className="map-sidebar">
             {selectedLoc ? (
               <motion.div 
                 key={selectedLoc.name}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="map-loc-detail"
               >
                  <div className="map-loc-badge">Selected Region</div>
                  <h2 className="map-loc-title">{selectedLoc.name}</h2>
                  <p className="map-loc-desc">Archival research covers {selectedLoc.keywords.length} major topics in this region.</p>
                  <div className="map-loc-keywords">
                    {selectedLoc.keywords.map(k => <span key={k} className="map-keyword">{k}</span>)}
                  </div>
                  <Link to={`/explore?q=${selectedLoc.name}`} className="map-loc-btn">
                     Explore {selectedLoc.name} Archives →
                  </Link>
               </motion.div>
             ) : (
               <div className="map-empty-state">
                  <div className="map-empty-icon">📍</div>
                  <h3>Select a Region</h3>
                  <p>Explore the historical records of the Kathiawar peninsula by selecting a region on the interactive map.</p>
               </div>
             )}
          </aside>
        </div>
      </main>

      <style>{`
        .leaflet-enabled {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
          min-height: 600px;
        }
        .map-visual-wrap {
          height: 600px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid var(--c-border);
        }
        .marker-goo-wrap {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: url('#goo');
        }
        .marker-pin {
          width: 14px;
          height: 14px;
          background: var(--c-terracotta);
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 0 10px var(--c-terracotta);
        }
        .marker-pulse {
          position: absolute;
          width: 24px;
          height: 24px;
          background: var(--c-terracotta);
          opacity: 0.3;
          border-radius: 50%;
          animation: map-pulse 2s infinite ease-out;
        }
        @keyframes map-pulse {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        .map-sidebar {
          background: var(--c-parchment-deep);
          padding: 2.5rem;
          border-radius: 12px;
          border: 1px solid var(--c-border);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
        }
          display: flex;
          flex-direction: column;
        }
        .map-loc-badge {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--c-terracotta);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        .map-loc-title {
          font-family: var(--font-display);
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--c-ink);
        }
        .map-loc-desc {
          font-size: 1rem;
          color: var(--c-ink-soft);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .map-loc-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .map-keyword {
          font-size: 0.75rem;
          padding: 0.4rem 0.8rem;
          background: var(--c-parchment);
          border: 1px solid var(--c-border);
          border-radius: 50px;
          color: var(--c-ink-soft);
        }
        .map-loc-btn {
          margin-top: auto;
          display: inline-block;
          background: var(--c-terracotta);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          transition: all 0.3s;
        }
        .map-loc-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(184, 85, 58, 0.3);
          color: white;
        }
        .map-empty-state {
          text-align: center;
          margin: auto;
        }
        .map-empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .map-empty-state h3 {
          font-family: var(--font-display);
          margin-bottom: 0.5rem;
        }
        .map-empty-state p {
          color: var(--c-ink-muted);
          font-size: 0.9rem;
        }
        .map-popup h3 {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1rem;
        }
        .map-popup p {
          margin: 4px 0 0;
          font-size: 0.8rem;
          color: var(--c-ink-muted);
        }

        @media (max-width: 900px) {
          .leaflet-enabled {
            grid-template-columns: 1fr;
          }
          .map-visual-wrap {
            height: 400px;
          }
        }
      `}</style>

      {/* SVG filter for gooey markers */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
