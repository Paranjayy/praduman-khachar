import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dr. Praduman Khachar — Historian · Author · YouTuber",
  "/about": "About — Dr. Praduman Khachar",
  "/books": "33 Books — Dr. Praduman Khachar",
  "/media": "Media & YouTube — Dr. Praduman Khachar",
  "/articles": "Video Articles — Dr. Praduman Khachar",
  "/writings": "Writings — Dr. Praduman Khachar",
};

/** Used in AppInner to keep tab title in sync with route */
export function usePageTitle(override?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (override) {
      document.title = `${override} — Dr. Praduman Khachar`;
    } else {
      document.title = PAGE_TITLES[pathname] ?? "Dr. Praduman Khachar";
    }
  }, [pathname, override]);
}
