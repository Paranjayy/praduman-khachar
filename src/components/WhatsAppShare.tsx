import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useTracker } from "../hooks/useAnalytics";

export default function WhatsAppShare() {
  const track = useTracker();
  const handleContact = () => {
    track("whatsapp_click", window.location.pathname);
    // Pre-filled contact message — opens WhatsApp with professional greeting
    const msg = `Namaste Dr. Praduman Khachar 🙏\n\nI visited your portfolio at praduman-khachar.vercel.app and would love to connect regarding your historical research on Saurashtra.\n\nCurrent page: ${window.location.href}`;
    // Opens to your WhatsApp — replace 91XXXXXXXXXX with actual number if available
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleContact}
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
            bottom: 5.25rem;
            right: 1rem;
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </motion.button>
  );
}
