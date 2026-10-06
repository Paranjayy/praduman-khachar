import type { Book, BookContributor } from "../types";

const name = (person: BookContributor) => person.given ? `${person.family}, ${person.given}` : person.family;
const fullName = (person: BookContributor) => [person.given, person.family].filter(Boolean).join(" ");
const initials = (person: BookContributor) => person.given?.split(/\s+/).map(part => `${part[0]}.`).join(" ");
const people = (book: Book, role: BookContributor["role"]) => (book.contributors ?? []).filter(person => person.role === role);
const text = (value: string) => value.replace(/[\r\n]+/g, " ").trim();
const year = (book: Book) => /^\d{4}$/.test(book.year ?? "") ? book.year : undefined;
const bookUrl = (book: Book) => book.slug ? `https://www.praduman.com/books/${encodeURIComponent(book.slug)}` : undefined;
const tex = (value: string) => text(value).replace(/[\\{}%&_$#~^]/g, character => ({
  "\\": "\\textbackslash{}", "~": "\\textasciitilde{}", "^": "\\textasciicircum{}",
}[character] ?? `\\${character}`));

export function validIsbn(value?: string): string | undefined {
  if (!value) return;
  const digits = value.replace(/[-\s]/g, "").toUpperCase();
  if (/^97[89]\d{10}$/.test(digits) && [...digits].reduce((sum, digit, i) => sum + Number(digit) * (i % 2 ? 3 : 1), 0) % 10 === 0) return digits;
  if (/^\d{9}[\dX]$/.test(digits) && [...digits].reduce((sum, digit, i) => sum + (digit === "X" ? 10 : Number(digit)) * (10 - i), 0) % 11 === 0) return digits;
}

export function contributorCredits(book: Book): string {
  return (["author", "editor", "translator"] as const).map(role => {
    const names = people(book, role).map(fullName).join(" & ");
    return names ? `${role === "author" ? "By" : role === "editor" ? "Edited by" : "Translated by"} ${names}` : "";
  }).filter(Boolean).join(" · ");
}

export function generateCitation(book: Book, format: "bibtex" | "mla" | "apa"): string {
  if (format === "bibtex") {
    // Include the title identity so publications from the same year do not collide.
    const identity = book.slug || Array.from(book.title).map(c => c.codePointAt(0)!.toString(16)).join("-");
    const key = `khachar-${identity.replace(/[^a-zA-Z0-9-]/g, "-")}`;
    const fields: [string, string | undefined][] = [
      ["author", people(book, "author").map(name).join(" and ")],
      ["editor", people(book, "editor").map(name).join(" and ")],
      ["title", book.title], ["year", year(book)], ["isbn", validIsbn(book.isbn)],
      ["publisher", book.publisher], ["url", bookUrl(book)],
    ];
    return `@book{${key},\n${fields.filter(([, value]) => value?.trim()).map(([name, value]) => `  ${name} = {${tex(value!)}}`).join(",\n")}\n}`;
  }
  const publisher = book.publisher?.trim() ? `${text(book.publisher)}. ` : "";
  const authors = people(book, "author");
  const editors = people(book, "editor");
  const primary = authors.length ? authors : editors;
  const editorLabel = editors.length > 1 ? "Eds." : "Ed.";
  const credit = primary.map(name).join(" & ") + (!authors.length && editors.length ? ` (${editorLabel})` : "");
  const editorNote = authors.length && editors.length ? ` Edited by ${editors.map(fullName).join(" & ")}.` : "";
  if (format === "mla") return `${credit ? `${credit} ` : ""}${text(book.title)}.${editorNote} ${book.publisher?.trim() ? `${text(book.publisher)}, ` : ""}${year(book) ?? "n.d."}.`;
  let apaCredit = primary.map(person => `${person.family}${person.given ? `, ${initials(person)}` : ""}`).join(" & ");
  if (!authors.length && editors.length) apaCredit += ` (${editorLabel})`;
  if (apaCredit && !apaCredit.endsWith(".")) apaCredit += ".";
  const apaEditorNote = authors.length && editors.length ? ` (${editors.map(person => [initials(person), person.family].filter(Boolean).join(" ")).join(" & ")}, ${editorLabel})` : "";
  return `${apaCredit ? `${apaCredit} ` : ""}(${year(book) ?? "n.d."}). ${text(book.title)}${apaEditorNote}. ${publisher}`.trim();
}

export function bibliographyRis(books: Book[]): string {
  return books.map(book => {
    const fields: [string, string | undefined][] = [
      ["TY", "BOOK"],
      ...(book.contributors ?? []).map((person): [string, string] => [person.role === "author" ? "AU" : person.role === "editor" ? "A3" : "A4", name(person)]),
      ["TI", book.title], ["SN", validIsbn(book.isbn)],
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
