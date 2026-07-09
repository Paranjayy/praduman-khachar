import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./hooks/useTheme";
import { CustomizerProvider } from "./hooks/useCustomizer";
import { usePageTitle } from "./hooks/usePageTitle";
import ScrollProgress from "./components/ScrollProgress";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import PageTransition from "./components/PageTransition";
import DesignCustomizer from "./components/DesignCustomizer";
import CommandPalette from "./components/CommandPalette";
import SurpriseMe from "./components/SurpriseMe";
import CustomCursor from "./components/CustomCursor";
import WhatsAppShare from "./components/WhatsAppShare";
import HelpModal from "./components/HelpModal";
import HomePage from "./pages/Home";
import BooksPage from "./pages/Books";
import BookDetailPage from "./pages/BookDetail";
import MediaPage from "./pages/Media";
import AboutPage from "./pages/About";
import ArticlesPage from "./pages/Articles";
import WritingsPage from "./pages/Writings";
import ExplorePage from "./pages/Explore";
import AdminPage from "./pages/Admin";
import PressPage from "./pages/Press";
import LabsPage from "./pages/Labs";
import LegalPage from "./pages/Legal";
import TimelinePage from "./pages/Timeline";
import CitationsPage from "./pages/Citations";
import MapPage from "./pages/Map";
import TopicsPage from "./pages/Topics";
import ReadingPage from "./pages/Reading";
import LineagePage from "./pages/Lineage";
import StatsPage from "./pages/Stats";
// import TranscriptReader from "./pages/TranscriptReader"; // Missing file
import Redirector from "./pages/Redirector";
import NotFoundPage from "./pages/NotFound";
import { CONFIG } from "./config";

import OfflineBanner from "./components/OfflineBanner";
import HistoryPulse from "./components/HistoryPulse";
import MobileBottomNav from "./components/MobileBottomNav";
import AnalyticsTracker from "./components/Analytics";

function AppInner() {
  usePageTitle(); // Updates document.title on every route change
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const art = [
      "       _________       ",
      "      /        /|      ",
      "     /________/ |      ",
      "    |        |  |      ",
      "    | DR. PK |  |      ",
      "    | ARCHIVE|  |      ",
      "    |________| /       ",
      "                       ",
      " DR. PRADUMAN KHACHAR  ",
      " v2.1.0-GOD WORKSTATION",
      " [GOD BUILD INITIALIZED] ",
    ];
    console.log(
      `%c${art.join("\n")}`,
      "color: #e26a4b; font-weight: bold; font-family: monospace;",
    );
    const quotes = [
      "History is a guide to navigation in perilous times.",
      "Archiving is an act of love for the future.",
      "The 222 states of Saurashtra hold the keys to our identity.",
      "Every transcript is a bridge between generations.",
    ];
    console.log(
      `%c[System]: ${quotes[Math.floor(Math.random() * quotes.length)]}`,
      "color: #888; font-style: italic;",
    );
    console.log(
      "%c[Status]: Scraper ingest running in background (354/442 videos indexed)",
      "color: #555;",
    );
  }, []);

  useEffect(() => {
    let lastKey = "";
    const handleNavShortcuts = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;

      const key = e.key.toLowerCase();
      if (lastKey === "g") {
        if (key === "h") {
          navigate("/");
          lastKey = "";
        } else if (key === "b") {
          navigate("/books");
          lastKey = "";
        } else if (key === "m") {
          navigate("/media");
          lastKey = "";
        } else if (key === "e") {
          navigate("/explore");
          lastKey = "";
        } else if (key === "l") {
          navigate("/lineage");
          lastKey = "";
        } else if (key === "?" || key === "/") {
          setHelpOpen(true);
          lastKey = "";
        } else {
          lastKey = "";
        }
      } else if (key === "g") {
        lastKey = "g";
        setTimeout(() => {
          lastKey = "";
        }, 1000); // Reset after 1s
      }
    };
    window.addEventListener("keydown", handleNavShortcuts);
    return () => window.removeEventListener("keydown", handleNavShortcuts);
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <AnalyticsTracker />
      <OfflineBanner />
      <HistoryPulse />
      <ScrollProgress />
      <Nav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/books"
            element={
              <PageTransition>
                <BooksPage />
              </PageTransition>
            }
          />
          <Route
            path="/books/:slug"
            element={
              <PageTransition>
                <BookDetailPage />
              </PageTransition>
            }
          />
          <Route
            path="/media"
            element={
              <PageTransition>
                <MediaPage />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            }
          />

          {/* Secret Routes: Hidden from Nav via CONFIG.HIDE_ARTICLES but accessible via slug */}
          <Route
            path="/articles"
            element={
              <PageTransition>
                <ArticlesPage />
              </PageTransition>
            }
          />
          <Route
            path="/articles/:slug"
            element={
              <PageTransition>
                <ArticlesPage />
              </PageTransition>
            }
          />

          <Route
            path="/writings"
            element={
              <PageTransition>
                <WritingsPage />
              </PageTransition>
            }
          />
          <Route
            path="/writings/:slug"
            element={
              <PageTransition>
                <WritingsPage />
              </PageTransition>
            }
          />

          <Route
            path="/explore"
            element={
              <PageTransition>
                <ExplorePage />
              </PageTransition>
            }
          />
          <Route
            path="/admin"
            element={
              <PageTransition>
                <AdminPage />
              </PageTransition>
            }
          />
          <Route
            path="/press"
            element={
              <PageTransition>
                <PressPage />
              </PageTransition>
            }
          />
          <Route
            path="/labs"
            element={
              <PageTransition>
                <LabsPage />
              </PageTransition>
            }
          />
          <Route
            path="/legal/:type"
            element={
              <PageTransition>
                <LegalPage />
              </PageTransition>
            }
          />
          <Route
            path="/topics"
            element={
              <PageTransition>
                <TopicsPage />
              </PageTransition>
            }
          />
          <Route
            path="/reading"
            element={
              <PageTransition>
                <ReadingPage />
              </PageTransition>
            }
          />
          <Route
            path="/timeline"
            element={
              <PageTransition>
                <TimelinePage />
              </PageTransition>
            }
          />
          <Route
            path="/citations"
            element={
              <PageTransition>
                <CitationsPage />
              </PageTransition>
            }
          />
          <Route
            path="/map"
            element={
              <PageTransition>
                <MapPage />
              </PageTransition>
            }
          />
          <Route
            path="/lineage"
            element={
              <PageTransition>
                <LineagePage />
              </PageTransition>
            }
          />
          <Route
            path="/stats"
            element={
              <PageTransition>
                <StatsPage />
              </PageTransition>
            }
          />
          <Route
            path="/read/:id"
            element={
              <PageTransition>
                <ExplorePage />
              </PageTransition>
            }
          />

          {/* Shortlinks */}
          <Route
            path="/v/:id"
            element={
              <PageTransition>
                <Redirector type="video" />
              </PageTransition>
            }
          />
          <Route
            path="/a/:slug"
            element={
              <PageTransition>
                <Redirector type="article" />
              </PageTransition>
            }
          />

          <Route
            path="*"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
      <BackToTop />
      <CommandPalette />
      <SurpriseMe />
      <DesignCustomizer />
      <WhatsAppShare />
      <MobileBottomNav />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      {/* Vercel Analytics — auto-tracks page views, link clicks, custom events */}
      <Analytics />
      <CustomCursor />
    </>
  );
}

export default function App() {
  return (
    <CustomizerProvider>
      <ThemeProvider>
        <div className="classic-grid-bg" />
        <AppInner />
      </ThemeProvider>
    </CustomizerProvider>
  );
}
