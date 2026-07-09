import { motion, AnimatePresence } from "framer-motion";
import { useOffline } from "../hooks/useOffline";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const offline = useOffline();

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10000,
            background: "#b8553a",
            color: "white",
            padding: "0.6rem 1rem",
            textAlign: "center",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-sans)",
          }}
        >
          <WifiOff size={16} />
          You're offline — some features may be limited
        </motion.div>
      )}
    </AnimatePresence>
  );
}
