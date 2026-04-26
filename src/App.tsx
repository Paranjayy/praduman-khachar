import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import ScrollProgress from "./components/ScrollProgress";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import HomePage from "./pages/Home";
import BooksPage from "./pages/Books";
import MediaPage from "./pages/Media";
import AboutPage from "./pages/About";

export default function App() {
  return (
    <ThemeProvider>
      <ScrollProgress />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
      <BackToTop />
    </ThemeProvider>
  );
}
