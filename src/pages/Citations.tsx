import { motion } from "framer-motion";
import { Copy, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { BOOKS } from "../data/content";

export default function CitationsPage() {
  usePageTitle("Citations & Bibliography");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateCitation = (book: any, format: "bibtex" | "mla" | "apa") => {
    const year = book.year || "n.d.";
    const publisher = book.publisher || "Privately Published";
    
    if (format === "bibtex") {
      return `@book{khachar${year},\n  author = {Khachar, Praduman},\n  title = {${book.title}},\n  year = {${year}},\n  publisher = {${publisher}},\n  address = {Saurashtra, India}\n}`;
    }
    if (format === "mla") {
      return `Khachar, Praduman. ${book.title}. ${publisher}, ${year}.`;
    }
    return `Khachar, P. (${year}). ${book.title}. Saurashtra, India: ${publisher}.`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="citations-page">
      <PageHeader 
        eyebrow="Academic Resources"
        title="Citations & Bibliography"
        subtitle="Standardized citations for Dr. Praduman Khachar's published research and archival works."
      />

      <main className="section citations-container">
        <div className="citations-grid">
          {BOOKS.map((book, i) => (
            <motion.div 
              key={book.title}
              className="citation-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
            >
              <div className="citation-header">
                <h3 className="citation-title">{book.title}</h3>
                <div className="citation-year">{book.year}</div>
              </div>
              
              <div className="citation-formats">
                <div className="citation-format-group">
                  <div className="citation-format-label">MLA</div>
                  <div className="citation-text">{generateCitation(book, "mla")}</div>
                  <button 
                    className="citation-copy-btn"
                    onClick={() => copyToClipboard(generateCitation(book, "mla"), book.title + "mla")}
                  >
                    {copiedId === book.title + "mla" ? <CheckCircle size={14} color="#4caf50" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="citation-format-group">
                  <div className="citation-format-label">APA</div>
                  <div className="citation-text">{generateCitation(book, "apa")}</div>
                  <button 
                    className="citation-copy-btn"
                    onClick={() => copyToClipboard(generateCitation(book, "apa"), book.title + "apa")}
                  >
                    {copiedId === book.title + "apa" ? <CheckCircle size={14} color="#4caf50" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="citation-format-group">
                  <div className="citation-format-label">BibTeX</div>
                  <pre className="citation-code"><code>{generateCitation(book, "bibtex")}</code></pre>
                  <button 
                    className="citation-copy-btn"
                    onClick={() => copyToClipboard(generateCitation(book, "bibtex"), book.title + "bib")}
                  >
                    {copiedId === book.title + "bib" ? <CheckCircle size={14} color="#4caf50" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
