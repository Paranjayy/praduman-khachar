import { beforeEach, expect, test, vi } from "vitest";
import { getBookmarks, toggleBookmark, saveBookBookmarks } from "../../src/components/CommandPalette";
import { BOOKS } from "../../src/data/content";

beforeEach(() => localStorage.clear());

test("saved items reject malformed JSON shapes instead of crashing search", () => {
  for (const value of ['{}', 'null', '[null, {"id": 42}]', 'broken']) {
    localStorage.setItem("pk-bookmarks", value);
    expect(getBookmarks()).toEqual([]);
  }
});

test("bookmark changes survive reload and distinguish books from videos", () => {
  toggleBookmark({ id: "same", title: "Book", type: "book" });
  toggleBookmark({ id: "same", title: "Video", type: "video" });
  expect(getBookmarks()).toHaveLength(2);
});

test("unavailable browser storage does not throw", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Blocked"); });
  expect(() => toggleBookmark({ id: "book", title: "Book", type: "book" })).not.toThrow();
});

test("legacy book titles remain available in saved search", () => {
  const book = BOOKS.find((b) => b.slug)!;
  localStorage.setItem("pk-bookmarks", JSON.stringify([book.title]));
  expect(getBookmarks()).toEqual([{ id: book.slug, title: book.title, type: "book" }]);
});

test("saving a book list preserves saved videos and supports removing books", () => {
  const book = BOOKS.find((b) => b.slug)!;
  toggleBookmark({ id: "video", title: "Video", type: "video" });
  saveBookBookmarks([book.title]);
  expect(getBookmarks()).toHaveLength(2);
  saveBookBookmarks([]);
  expect(getBookmarks()).toEqual([{ id: "video", title: "Video", type: "video" }]);
});
