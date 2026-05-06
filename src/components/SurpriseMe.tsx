import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import { Dices, History } from "lucide-react";

export default function SurpriseMe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rouletteTitle, setRouletteTitle] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSurprise = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setRouletteTitle("Scanning Archives...");
    track("surprise_me_click");
    
    try {
      const res = await fetch("/data/videos.json");
      if (!res.ok) throw new Error("Failed to load videos");
      const data = await res.json();
      const videos = data.videos || [];
      
      if (videos.length > 0) {
        // Start roulette animation
        let iterations = 0;
        const maxIterations = 12;
        
        const cycle = () => {
          const randomIdx = Math.floor(Math.random() * videos.length);
          setRouletteTitle(videos[randomIdx].title);
          
          iterations++;
          if (iterations < maxIterations) {
            const delay = 80 + (iterations * 20); // Exponential slow down
            timerRef.current = setTimeout(cycle, delay);
          } else {
            // Final landing
            const finalVideo = videos[Math.floor(Math.random() * videos.length)];
            setRouletteTitle(finalVideo.title);
            const slug = finalVideo.slug && finalVideo.slug !== "-" ? finalVideo.slug : finalVideo.id;
            
            setTimeout(() => {
              navigate(`/articles/${slug}`);
              setLoading(false);
              setRouletteTitle("");
            }, 800);
          }
        };
        
        cycle();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setRouletteTitle("");
    }
  }, [navigate, loading]);

  return (
    <>
      {loading && (
        <div className="surprise-roulette-overlay">
          <div className="roulette-container">
            <div className="roulette-icon">
              <History size={40} className="animate-pulse" />
            </div>
            <div className="roulette-label">Locus Inventus...</div>
            <div className="roulette-title">{rouletteTitle}</div>
          </div>
        </div>
      )}

      <button
        onClick={handleSurprise}
        className={`surprise-me-fab ${loading ? 'loading' : ''}`}
        title="Surprise Me (History Roulette)"
        aria-label="Random video"
      >
        <div className="surprise-me-inner">
          <Dices size={20} className={loading ? 'animate-spin' : ''} />
          <span className="surprise-me-text">History Roulette</span>
        </div>
        
        <style>{`
          .surprise-me-fab {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 200;
            background: var(--c-terracotta);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 0.8rem 1.4rem;
            cursor: pointer;
            box-shadow: 0 10px 25px oklch(0.3 0.1 30 / 0.3);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            display: flex;
            align-items: center;
          }
          
          .surprise-me-fab:hover {
            transform: translateY(-5px) scale(1.05);
            background: var(--c-terracotta-light);
            box-shadow: 0 15px 30px oklch(0.3 0.1 30 / 0.4);
          }
          
          .surprise-me-inner {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            font-family: var(--font-body);
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          
          .surprise-me-fab.loading {
            transform: scale(0.9);
            opacity: 0.5;
            pointer-events: none;
          }
          
          .surprise-roulette-overlay {
            position: fixed;
            inset: 0;
            background: rgba(14, 12, 10, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.4s ease-out;
          }
          
          .roulette-container {
            max-width: 600px;
            text-align: center;
            padding: 2rem;
          }
          
          .roulette-icon {
            color: var(--c-terracotta);
            margin-bottom: 2rem;
            display: flex;
            justify-content: center;
          }
          
          .roulette-label {
            font-family: var(--font-heading);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            color: var(--c-terracotta);
            margin-bottom: 1rem;
            opacity: 0.7;
          }
          
          .roulette-title {
            font-family: var(--font-heading);
            font-size: 2rem;
            color: var(--c-cream);
            line-height: 1.2;
            min-height: 5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-spin {
            animation: spin 1s linear infinite;
          }

          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: .5; transform: scale(1.1); }
          }
          
          @media (max-width: 600px) {
            .surprise-me-fab {
              bottom: 1.5rem;
              right: 1.5rem;
              padding: 0.7rem 1.2rem;
            }
            .surprise-me-text {
              font-size: 0.75rem;
            }
            .roulette-title {
              font-size: 1.4rem;
            }
          }
        `}</style>
      </button>
    </>
  );
}
