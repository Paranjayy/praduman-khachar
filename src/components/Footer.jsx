import { SITE } from "../data/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      © {year} {SITE.name} · Junagadh, Gujarat · All rights reserved
    </footer>
  );
}
