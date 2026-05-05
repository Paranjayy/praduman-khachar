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
import HomeTOC from "../components/HomeTOC";

export default function HomePage() {
  const revealRef = useScrollReveal();

  return (
    <div className="home-reveal-wrapper">
      <HomeTOC />
      <section id="hero" ref={revealRef}><Hero /></section>
      <section id="stats" ref={revealRef}><StatsRibbon /></section>
      <section id="today" ref={revealRef}><OnThisDay /></section>
      <section id="talks" ref={revealRef}><FeaturedTalks /></section>
      <section id="about" ref={revealRef}><About /></section>
      <section id="achievements" ref={revealRef}><Achievements /></section>
      <section id="career" ref={revealRef}><Career /></section>
      <section id="testimonials" ref={revealRef}><Testimonials /></section>
      <section id="media" ref={revealRef}><MediaSection /></section>
      <section id="support" ref={revealRef}><Support /></section>
      <section id="contact" ref={revealRef}><Contact /></section>
    </div>
  );
}



