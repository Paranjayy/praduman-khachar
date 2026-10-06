import { expect, test } from "vitest";
import { BOOKS } from "../../src/data/content";
import { bibliographyRis, generateCitation } from "../../src/lib/citations";
import type { Book } from "../../src/types";

test("the catalog exports separate RIS records and unique BibTeX identities", () => {
  const ris = bibliographyRis(BOOKS);
  expect(ris.match(/^TY  - BOOK$/gm)).toHaveLength(BOOKS.length);
  expect(ris.match(/^ER  - /gm)).toHaveLength(BOOKS.length);
  const keys = BOOKS.map(book => generateCitation(book, "bibtex").split(",")[0]);
  expect(new Set(keys).size).toBe(BOOKS.length);
});

test("citation exports retain Unicode and omit unknown publication details", () => {
  const book: Book = { title: "ઇતિહાસ {Heritage} & Culture", category: "history" };
  const ris = bibliographyRis([book]);
  expect(ris).toContain("TI  - ઇતિહાસ {Heritage} & Culture");
  expect(ris).not.toMatch(/^(PY|PB|CY|UR)  - /m);
  const bib = generateCitation(book, "bibtex");
  expect(bib).toContain("\\{Heritage\\} \\& Culture");
  expect(bib).not.toMatch(/year =|publisher =|address =/);
  expect(generateCitation(book, "apa")).toContain("(n.d.)");
});

test("line breaks in metadata cannot inject extra RIS tags", () => {
  const book: Book = { title: "Title\nER  - \nTY  - JOUR", category: "history", year: "unknown" };
  const ris = bibliographyRis([book]);
  expect(ris.match(/^TY  - /gm)).toHaveLength(1);
  expect(ris.match(/^ER  - /gm)).toHaveLength(1);
  expect(ris).not.toContain("PY  - unknown");
});
