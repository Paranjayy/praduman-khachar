import { expect, test } from "vitest";
import { bookmarkMarkdown } from "../../src/lib/bookmarkExport";

test("export preserves Gujarati titles and escapes Markdown with safe links", () => {
  const text = bookmarkMarkdown([
    { id: "book/#?", title: "ગુજરાત [ઇતિહાસ]\nNotes", type: "book" },
    { id: "video", title: "History", type: "video" },
  ]);
  expect(text).toContain("ગુજરાત \\[ઇતિહાસ\\] Notes");
  expect(text).toContain("https://www.praduman.com/books/book%2F%23%3F");
  expect(text).toContain("https://www.praduman.com/articles/video");
});
