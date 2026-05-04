import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { usePageTitle } from "../hooks/usePageTitle";

const LEGAL_CONTENT: Record<string, { title: string, body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "Your privacy is important to us. This policy outlines how we handle your data.",
      "1. Information Collection: We do not collect personal identification information from users unless voluntarily provided.",
      "2. Usage: Any information provided is used solely for the purpose of communicating archival research or responding to inquiries.",
      "3. Cookies: We use minimal session cookies for site performance and analytics (Vercel Analytics).",
      "4. Third-Party Links: Our site contains links to other websites (YouTube, Instagram). We are not responsible for their privacy practices."
    ]
  },
  terms: {
    title: "Terms of Service",
    body: [
      "By accessing this archive, you agree to the following terms.",
      "1. Usage: This site is for educational and archival purposes. Reproduction of contents without attribution is prohibited.",
      "2. Content: While we strive for historical accuracy, we are not liable for any errors or omissions in the archival data.",
      "3. Intellectual Property: All videos, writings, and photographs are the property of Praduman Khachar unless otherwise noted.",
      "4. Modifications: We reserve the right to modify these terms at any time."
    ]
  }
};

export default function LegalPage() {
  const { type = "privacy" } = useParams();
  const content = LEGAL_CONTENT[type] || LEGAL_CONTENT.privacy;
  
  usePageTitle(content.title);

  return (
    <>
      <PageHeader
        label="Legal"
        title={content.title}
        subtitle="Last updated: May 2026"
      />
      
      <main className="section legal-page">
        <div className="legal-container">
          <div className="legal-card">
            {content.body.map((para, i) => (
              <p key={i} className={para.match(/^\d\./) ? "legal-item" : "legal-intro"}>
                {para}
              </p>
            ))}
          </div>
          
          <div className="legal-contact">
            <h3>Questions?</h3>
            <p>If you have questions about our policies, please contact us via the form on the home page.</p>
          </div>
        </div>
      </main>
    </>
  );
}
