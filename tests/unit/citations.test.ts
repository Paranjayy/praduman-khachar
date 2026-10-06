import { expect, test } from "vitest";
import { BOOKS } from "../../src/data/content";
import { bibliographyRis, contributorCredits, generateCitation, validIsbn } from "../../src/lib/citations";
import type { Book } from "../../src/types";

test("the catalog exports separate RIS records and unique BibTeX identities", () => {
  expect(BOOKS.every(book => book.contributors?.length)).toBe(true);
  const ris = bibliographyRis(BOOKS);
  expect(ris.match(/^TY  - BOOK$/gm)).toHaveLength(BOOKS.length);
  expect(ris.match(/^ER  - /gm)).toHaveLength(BOOKS.length);
  const keys = BOOKS.map(book => generateCitation(book, "bibtex").split(",")[0]);
  expect(new Set(keys).size).toBe(BOOKS.length);
});

test("co-authors and Watson edition editors retain their roles in every export", () => {
  const coauthored = BOOKS.find(book => book.slug === "tasviroma-junagadh")!;
  expect(bibliographyRis([coauthored])).toContain("AU  - Vala, Dhirubhai");
  expect(bibliographyRis([coauthored]).match(/^AU  - /gm)).toHaveLength(2);
  for (const slug of ["kathio-no-itihas", "history-of-kathi"]) {
    const book = BOOKS.find(book => book.slug === slug)!;
    const ris = bibliographyRis([book]);
    expect(ris).toContain("AU  - Watson, John W.");
    expect(ris).toContain("A3  - Khachar, Pradumankumar B.");
    expect(ris).not.toContain("AU  - Khachar");
    expect(generateCitation(book, "bibtex")).toContain("editor = {Khachar, Pradumankumar B.}");
    expect(generateCitation(book, "apa")).toContain("Watson, J. W.");
    expect(generateCitation(book, "mla")).toContain("Edited by");
    expect(contributorCredits(book)).toContain("Edited by Pradumankumar B. Khachar");
  }
});

test("valid ISBN-10 and ISBN-13 survive exports, malformed identifiers are omitted", () => {
  expect(validIsbn("978-81-7790-479-6")).toBe("9788177904796");
  expect(validIsbn("0-8044-2957-X")).toBe("080442957X");
  for (const invalid of [undefined, "978-81-9005-01-1", "9788177904790", "1234567890", "12345"]) {
    expect(validIsbn(invalid)).toBeUndefined();
  }
  const book = BOOKS.find(book => book.slug === "tasviroma-junagadh")!;
  expect(bibliographyRis([book])).toContain("SN  - 9788177904796");
  expect(generateCitation(book, "bibtex")).toContain("isbn = {9788177904796}");
  expect(bibliographyRis([{ ...book, isbn: "invalid" }])).not.toMatch(/^SN  - /m);
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
