import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppShare() {
  const handleShare = () => {
    const url = window.location.href;
    const title = document.title;
    const text = `Check out this historical record from the Dr. Praduman Khachar Archival Workstation: ${title}\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleShare}
      className="wa-share-btn"
      title="Share on WhatsApp"
      aria-label="Share on WhatsApp"
    >
      <MessageCircle size={24} />
      <style>{`
        .wa-share-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #25D366;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
          z-index: 1000;
          transition: transform 0.2s;
        }
        
        @media (max-width: 600px) {
          .wa-share-btn {
            bottom: 1.5rem;
            right: 1.5rem;
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </motion.button>
  );
}
