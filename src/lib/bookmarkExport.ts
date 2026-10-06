import type { BookmarkItem } from "../components/CommandPalette";

export function bookmarkMarkdown(items: BookmarkItem[]): string {
  const escape = (text: string) => text.replace(/[\r\n]+/g, " ").replace(/[\\\[\]*_`]/g, "\\$&");
  return "# Saved archive items\n\nFrom Dr. Pradumankumar B. Khachar's archive.\n\n" +
    items.map((item) => {
      const path = item.type === "book" ? "books" : "articles";
      return `- [${escape(item.title)}](https://www.praduman.com/${path}/${encodeURIComponent(item.id)}) (${item.type})`;
    }).join("\n") + "\n";
}

export function downloadBookmarks(items: BookmarkItem[]) {
  const url = URL.createObjectURL(new Blob([bookmarkMarkdown(items)], { type: "text/markdown;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "khachar-saved-items.md";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
