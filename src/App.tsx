import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./hooks/useTheme";
import { usePageTitle } from "./hooks/usePageTitle";
import ScrollProgress from "./components/ScrollProgress";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import HomePage from "./pages/Home";
import BooksPage from "./pages/Books";
import MediaPage from "./pages/Media";
import AboutPage from "./pages/About";
import ArticlesPage from "./pages/Articles";
import WritingsPage from "./pages/Writings";
import AdminPage from "./pages/Admin";

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
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
      <BackToTop />
      {/* Vercel Analytics — auto-tracks page views, link clicks, custom events */}
      <Analytics />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
