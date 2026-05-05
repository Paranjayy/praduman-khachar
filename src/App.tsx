import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./hooks/useTheme";
import { CustomizerProvider } from "./hooks/useCustomizer";
import { usePageTitle } from "./hooks/usePageTitle";
import ScrollProgress from "./components/ScrollProgress";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import DesignCustomizer from "./components/DesignCustomizer";
import CommandPalette from "./components/CommandPalette";
import SurpriseMe from "./components/SurpriseMe";
import CustomCursor from "./components/CustomCursor";
import HomePage from "./pages/Home";
import BooksPage from "./pages/Books";
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
import NotFoundPage from "./pages/NotFound";
import { CONFIG } from "./config";

function AppInner() {
  usePageTitle(); // Updates document.title on every route change

  useEffect(() => {
    const art = [
      "  ____  ____    ____  ____  ____  __  __  __  __  ____  _  _ ",
      " (  _ \\(  _ \\  (  _ \\(  _ \\(  _ \\(  )(  )(  \\/  )(  _ \\( \\/ )",
      "  )___/ )   /   )___/ )   / ) _ ( )(__)(  )    (  ) _ ( \\  / ",
      " (__)  (_)\\_)  (__)  (_)\\_)(____/(______)(_\\/\\/_)(____/ (__) ",
      "                                                              ",
      " Archive Workstation v2.1.0-GOD  |  Dr. Praduman Khachar      ",
    ];
    console.log(`%c${art.join('\n')}`, "color: #e26a4b; font-weight: bold; font-family: monospace;");
    const quotes = [
      "History is a guide to navigation in perilous times.",
      "Archiving is an act of love for the future.",
      "The 222 states of Saurashtra hold the keys to our identity.",
      "Every transcript is a bridge between generations.",
    ];
    console.log(`%c[System]: ${quotes[Math.floor(Math.random() * quotes.length)]}`, "color: #888; font-style: italic;");
  }, []);

  return (
    <>
      <ScrollProgress />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Secret Routes: Hidden from Nav via CONFIG.HIDE_ARTICLES but accessible via slug */}
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticlesPage />} />

        <Route path="/writings" element={<WritingsPage />} />
        <Route path="/writings/:slug" element={<WritingsPage />} />
        
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/labs" element={<LabsPage />} />
        <Route path="/legal/:type" element={<LegalPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/reading" element={<ReadingPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/citations" element={<CitationsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <BackToTop />
      <CommandPalette />
      <SurpriseMe />
      <DesignCustomizer />
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
