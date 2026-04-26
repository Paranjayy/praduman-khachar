import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dr. Praduman Khachar — Historian · Author · Researcher",
  "/about": "About — Dr. Praduman Khachar",
  "/books": "33 Books — Dr. Praduman Khachar",
  "/media": "Media & YouTube — Dr. Praduman Khachar",
};

export function usePageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = PAGE_TITLES[pathname] ?? "Dr. Praduman Khachar";
    document.title = title;
  }, [pathname]);
}
