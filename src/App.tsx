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
<<<<<<< Updated upstream
=======
import ArticlesPage from "./pages/Articles";
import WritingsPage from "./pages/Writings";
import ExplorePage from "./pages/Explore";
import AdminPage from "./pages/Admin";
import PressPage from "./pages/Press";
import LabsPage from "./pages/Labs";
import TopicsPage from "./pages/Topics";
import ReadingPage from "./pages/Reading";
import NotFoundPage from "./pages/NotFound";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
      </Routes>
      <Footer />
      <BackToTop />
    </ThemeProvider>
  );
}
