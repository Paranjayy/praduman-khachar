import { Routes, Route } from "react-router-dom";
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
import TopicsPage from "./pages/Topics";
import ReadingPage from "./pages/Reading";
import NotFoundPage from "./pages/NotFound";

function AppInner() {
  usePageTitle(); // Updates document.title on every route change
  return (
    <>
      <ScrollProgress />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticlesPage />} />
        <Route path="/writings" element={<WritingsPage />} />
        <Route path="/writings/:slug" element={<WritingsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/labs" element={<LabsPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/reading" element={<ReadingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <BackToTop />
      <CommandPalette />
      <SurpriseMe />
      <DesignCustomizer />
      {/* Vercel Analytics — auto-tracks page views, link clicks, custom events */}
      <Analytics />
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

