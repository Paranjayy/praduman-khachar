import Hero from "../components/Hero";
import StatsRibbon from "../components/StatsRibbon";
import About from "../components/About";
import Achievements from "../components/Achievements";
import Testimonials from "../components/Testimonials";
import Career from "../components/Career";
import Publications from "../components/Publications";
import MediaSection from "../components/Media";
import Support from "../components/Support";
import Contact from "../components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsRibbon />
      <About />
      <Achievements />
      <Testimonials />
      <Career />
      <Publications />
      <MediaSection />
      <Support />
      <Contact />
    </>
  );
}

