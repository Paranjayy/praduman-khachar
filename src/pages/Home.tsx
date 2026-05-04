import Hero from "../components/Hero";
import StatsRibbon from "../components/StatsRibbon";
import FeaturedTalks from "../components/FeaturedTalks";
import OnThisDay from "../components/OnThisDay";
import About from "../components/About";
import Achievements from "../components/Achievements";
import Testimonials from "../components/Testimonials";
import Career from "../components/Career";
import Publications from "../components/Publications";
import MediaSection from "../components/Media";
import Support from "../components/Support";
import Contact from "../components/Contact";

import { useScrollReveal } from "../hooks/useScrollReveal";

export default function HomePage() {
  const revealRef = useScrollReveal();

  return (
    <div className="home-reveal-wrapper">
      <section ref={revealRef}><Hero /></section>
      <section ref={revealRef}><StatsRibbon /></section>
      <section ref={revealRef}><OnThisDay /></section>
      <section ref={revealRef}><FeaturedTalks /></section>
      <section ref={revealRef}><About /></section>
      <section ref={revealRef}><Achievements /></section>
      <section ref={revealRef}><Testimonials /></section>
      <section ref={revealRef}><Career /></section>
      <section ref={revealRef}><Publications /></section>
      <section ref={revealRef}><MediaSection /></section>
      <section ref={revealRef}><Support /></section>
      <section ref={revealRef}><Contact /></section>
    </div>
  );
}



