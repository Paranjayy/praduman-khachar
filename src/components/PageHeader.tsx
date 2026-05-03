// Shared page header for Books, About, Media pages.
// Replaces the broken/missing hero sections on inner pages with a
// consistent, editorial-grade header that always renders immediately
// (no IntersectionObserver—already in viewport on load).

interface Props {
  label?: string;    // backward compatibility
  eyebrow?: string;  // new preferred name
  title: string;
  subtitle?: string;
  dark?: boolean;     // dark background variant (media page)
  children?: React.ReactNode;
}

export default function PageHeader({ label, eyebrow, title, subtitle, dark = false, children }: Props) {
  const displayLabel = eyebrow || label || "";
  return (
    <header className={`page-header${dark ? " page-header--dark" : ""}`}>
      <div className="page-header-inner">
        <p className="page-header-label">{displayLabel}</p>
        <h1 className="page-header-title">{title}</h1>
        <div className="page-header-rule" />
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        {children}
      </div>
      {/* Bottom rule */}
      <div className="page-header-bottom" />
    </header>
  );
}
