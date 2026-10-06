import { motion } from "framer-motion";
import { Copy, Download, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";
import { BOOKS } from "../data/content";
import { downloadRis, generateCitation } from "../lib/citations";

export default function CitationsPage() {
  usePageTitle("Citations & Bibliography");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [copyMessage, setCopyMessage] = useState("");
  useEffect(() => {
    if (!copiedId) return;
    const timer = setTimeout(() => {
      setCopiedId(null);
      setCopyMessage("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [copiedId]);
  const copyToClipboard = async (text: string, id: string) => {
    setCopiedId(null);
    setCopyMessage("");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setCopyMessage("Citation copied.");
    } catch {
      setCopyMessage("Could not copy. Select the citation text to copy it manually, or download the RIS file.");
    }
  };

  return (
    <div className="citations-page">
      <PageHeader 
        eyebrow="Academic Resources"
        title="Citations & Bibliography"
        subtitle="Standardized citations for Dr. Praduman Khachar's published research and archival works."
      />

      <main className="section citations-container">
        <div className="citation-tools">
          <button className="citation-download" onClick={() => downloadRis(BOOKS)}>
            <Download size={16} aria-hidden="true" /> Download bibliography (.ris)
          </button>
          <p>Import the file into Zotero or another reference manager. Records use the archive’s catalog metadata; check against the book before submitting a reference.</p>
        </div>
        <p className="citation-status" role="status">{copyMessage}</p>
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
                <div className="citation-record-actions">
                  <span className="citation-year">{book.year}</span>
                  <button className="citation-download" onClick={() => downloadRis([book], `${book.slug || "khachar-book"}.ris`)} aria-label={`Download RIS for ${book.title}`}>
                    <Download size={14} aria-hidden="true" /> RIS
                  </button>
                </div>
              </div>
              
              <div className="citation-formats">
                <div className="citation-format-group">
                  <div className="citation-format-label">MLA</div>
                  <div className="citation-text">{generateCitation(book, "mla")}</div>
                  <button 
                    className="citation-copy-btn"
                    aria-label={`Copy MLA citation for ${book.title}`}
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
                    aria-label={`Copy APA citation for ${book.title}`}
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
                    aria-label={`Copy BibTeX citation for ${book.title}`}
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
