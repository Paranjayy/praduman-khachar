import { useState, useCallback } from "react";

interface RecentBook {
  title: string;
  slug: string;
  category: string;
  viewedAt: number;
}

const STORAGE_KEY = "pk-recently-viewed";
const MAX_ITEMS = 8;

function load(): RecentBook[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<RecentBook[]>(load);

  const addRecent = useCallback((book: Omit<RecentBook, "viewedAt">) => {
    setRecent(prev => {
      const filtered = prev.filter(b => b.slug !== book.slug);
      const next = [{ ...book, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecent([]);
  }, []);

  return { recent, addRecent, clearRecent };
}
