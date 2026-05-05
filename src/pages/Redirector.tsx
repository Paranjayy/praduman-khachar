import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Redirector({ type }: { type: 'video' | 'article' }) {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (type === 'video' && id) {
      // Redirect to explore with video ID
      navigate(`/explore?v=${id}`, { replace: true });
    } else if (type === 'article' && slug) {
      // Redirect to specific article
      navigate(`/articles/${slug}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [id, slug, type, navigate]);

  return (
    <div className="redirect-container" style={{ 
      height: '60vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '1rem',
      color: 'var(--c-text-muted)'
    }}>
      <div className="loader-simple" />
      <p>Redirecting you to the archives...</p>
      <style>{`
        .loader-simple {
          width: 40px;
          height: 40px;
          border: 3px solid var(--c-border);
          border-top-color: var(--c-terracotta);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
