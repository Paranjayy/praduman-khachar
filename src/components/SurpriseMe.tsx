import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import { Dices } from "lucide-react";

export default function SurpriseMe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSurprise = useCallback(async () => {
    setLoading(true);
    track("surprise_me_click");
    
    try {
      const res = await fetch("/data/videos.json");
      if (!res.ok) throw new Error("Failed to load videos");
      const data = await res.json();
      const videos = data.videos || [];
      
      if (videos.length > 0) {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const slug = randomVideo.slug && randomVideo.slug !== "-" ? randomVideo.slug : randomVideo.id;
        
        // Add a small delay for a "roulette" feel
        setTimeout(() => {
          navigate(`/articles/${slug}`);
          setLoading(false);
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [navigate]);

  return (
    <button
      onClick={handleSurprise}
      className={`surprise-me-fab ${loading ? 'loading' : ''}`}
      title="Surprise Me (History Roulette)"
      aria-label="Random video"
    >
      <div className="surprise-me-inner">
        <Dices size={20} className={loading ? 'animate-spin' : ''} />
        <span className="surprise-me-text">Surprise Me</span>
      </div>
      
      <style>{`
        .surprise-me-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 90;
          background: var(--c-terracotta);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 0.8rem 1.4rem;
          cursor: pointer;
          box-shadow: 0 10px 25px oklch(0.3 0.1 30 / 0.3);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
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
          width: 50px;
          padding: 0.8rem;
        }
        
        .surprise-me-fab.loading .surprise-me-text {
          display: none;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
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
        }
      `}</style>
    </button>
  );
}
