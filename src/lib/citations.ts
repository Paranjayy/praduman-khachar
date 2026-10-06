import type { Book } from "../types";

const author = "Khachar, Pradumankumar B.";
const text = (value: string) => value.replace(/[\r\n]+/g, " ").trim();
const year = (book: Book) => /^\d{4}$/.test(book.year ?? "") ? book.year : undefined;
const bookUrl = (book: Book) => book.slug ? `https://www.praduman.com/books/${encodeURIComponent(book.slug)}` : undefined;
const tex = (value: string) => text(value).replace(/[\\{}%&_$#~^]/g, character => ({
  "\\": "\\textbackslash{}", "~": "\\textasciitilde{}", "^": "\\textasciicircum{}",
}[character] ?? `\\${character}`));

export function generateCitation(book: Book, format: "bibtex" | "mla" | "apa"): string {
  if (format === "bibtex") {
    // Include the title identity so publications from the same year do not collide.
    const identity = book.slug || Array.from(book.title).map(c => c.codePointAt(0)!.toString(16)).join("-");
    const key = `khachar-${identity.replace(/[^a-zA-Z0-9-]/g, "-")}`;
    const fields: [string, string | undefined][] = [
      ["author", author], ["title", book.title], ["year", year(book)],
      ["publisher", book.publisher], ["url", bookUrl(book)],
    ];
    return `@book{${key},\n${fields.filter(([, value]) => value?.trim()).map(([name, value]) => `  ${name} = {${tex(value!)}}`).join(",\n")}\n}`;
  }
  const publisher = book.publisher?.trim() ? `${text(book.publisher)}. ` : "";
  if (format === "mla") return `${author} ${text(book.title)}. ${book.publisher?.trim() ? `${text(book.publisher)}, ` : ""}${year(book) ?? "n.d."}.`;
  return `Khachar, P. B. (${year(book) ?? "n.d."}). ${text(book.title)}. ${publisher}`.trim();
}

export function bibliographyRis(books: Book[]): string {
  return books.map(book => {
    const fields: [string, string | undefined][] = [
      ["TY", "BOOK"], ["AU", author], ["TI", book.title],
      ["PY", year(book)], ["PB", book.publisher], ["UR", bookUrl(book)],
    ];
    return fields.filter(([, value]) => value?.trim()).map(([tag, value]) => `${tag}  - ${text(value!)}`).join("\r\n") + "\r\nER  - \r\n";
  }).join("\r\n");
}

export function downloadRis(books: Book[], filename = "khachar-bibliography.ris") {
  const url = URL.createObjectURL(new Blob([bibliographyRis(books)], { type: "application/x-research-info-systems;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
