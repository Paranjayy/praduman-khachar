import { Link } from "react-router-dom";
import { SITE } from "../data/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/books">Books</Link>
          <Link to="/media">Media</Link>
        </div>
        <p className="footer-copy">
          © {year} {SITE.name} · {SITE.location} · All rights reserved
        </p>
      </div>
    </footer>
  );
}
