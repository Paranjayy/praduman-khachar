import { useGhostFeed } from "../hooks/useGhostFeed";
import { useReveal } from "../hooks/useAnimations";

export default function GhostFeed() {
  const { feed, loading } = useGhostFeed();
  const [ref, visible] = useReveal();

  if (loading || feed.length === 0) return null;

  return (
    <div className="ghost-feed-container">
      <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
        <p className="section-label">Digital Footprint</p>
        <h2 className="section-title">The Ghost Feed</h2>
        <div className="section-divider" />
        <p className="section-description">
          Real-time intercepts from Instagram and social channels. 
          Ephemeral scholarly activity and visual archives.
        </p>
      </div>

      <div className="ghost-grid">
        {feed.map((item, index) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ghost-card"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s ${index * 0.08}s ease-out`
            }}
          >
            <div className="ghost-media-wrapper">
              <img src={item.thumbnail} alt={item.caption} loading="lazy" />
              {item.type === 'video' && <div className="video-badge">▶</div>}
              {item.type === 'carousel' && <div className="carousel-badge">📑</div>}
              <div className="ghost-overlay">
                <div className="ghost-meta">
                  <span>❤️ {item.likes.toLocaleString()}</span>
                  <span>💬 {item.comments.toLocaleString()}</span>
                </div>
                <p className="ghost-caption">{item.caption.slice(0, 80)}...</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
