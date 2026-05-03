import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("404 - Lost in History");

  return (
    <>
      <PageHeader
        label="Error 404"
        title="Lost in History"
        subtitle="The document or archive you are looking for has been moved or does not exist in this era."
        dark
      />
      
      <main className="section" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem' }}>
        <div className="not-found-visual" style={{ marginBottom: '2rem', position: 'relative' }}>
          <div className="otd-icon" style={{ fontSize: '6rem', filter: 'sepia(0.5)', animation: 'float 4s ease-in-out infinite' }}>📜</div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2rem', opacity: 0.4 }}>❓</div>
        </div>
        
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--c-ink)' }}>Archive Entry Missing</h2>
        <p style={{ color: 'var(--c-ink-soft)', maxWidth: '32rem', marginBottom: '2.5rem', fontSize: '1.1rem', line_height: '1.7' }}>
          This specific manuscript or historical event seems to have slipped through the cracks of time. Even the most meticulous archives have their mysteries.
        </p>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="show-more-btn" style={{ minWidth: '160px' }}>
            Back to the Present
          </Link>
          <Link to="/explore" className="show-more-btn" style={{ background: 'var(--c-terracotta)', color: 'white', border: 'none', minWidth: '160px' }}>
            Search the Archive
          </Link>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
          }
        `}</style>
      </main>
    </>
  );
}
