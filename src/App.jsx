import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomePage from "./pages/Home";
import BooksPage from "./pages/Books";
import MediaPage from "./pages/Media";
import AboutPage from "./pages/About";

export default function App() {
  return (
    <ThemeProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}
