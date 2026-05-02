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
      
      <main className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="otd-icon" style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>📜</div>
        <p style={{ color: 'var(--c-ink-soft)', maxWidth: '30rem', marginBottom: 'var(--space-lg)' }}>
          Even the most meticulous historians lose their way sometimes. Let's get you back to the present.
        </p>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <Link to="/" className="show-more-btn">
            Return Home
          </Link>
          <Link to="/explore" className="show-more-btn" style={{ background: 'var(--c-terracotta)', color: 'white' }}>
            Explore Archive
          </Link>
        </div>
      </main>
    </>
  );
}
