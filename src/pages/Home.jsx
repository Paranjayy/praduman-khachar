import Hero from "../components/Hero";
import StatsRibbon from "../components/StatsRibbon";
import About from "../components/About";
import Achievements from "../components/Achievements";
import Career from "../components/Career";
import Publications from "../components/Publications";
import MediaSection from "../components/Media";
import Contact from "../components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsRibbon />
      <About />
      <Achievements />
      <Career />
      <Publications />
      <MediaSection />
      <Contact />
    </>
  );
}
