import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { Preloader } from "@/components/Preloader";
import { Certainty } from "@/components/home/Certainty";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Insights } from "@/components/home/Insights";
import { Maverick } from "@/components/home/Maverick";
import { Projects } from "@/components/home/Projects";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";

// The single route. Section order and the reasoning behind it are in README.md (Recon, proposed section list).
export default function Home() {
  return (
    <>
      <a className="skip" href="#certainty">Skip to content</a>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Certainty />
        <Services />
        <Maverick />
        <Projects />
        <Testimonials />
        <Insights />
        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
