import Nav from "@/components/Nav";
import HomeHero from "@/components/HomeHero";
import ScrollRevealParagraph from "@/components/ScrollRevealParagraph";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import InAction from "@/components/InAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <Nav />
      <main className="flex-1">
        <HomeHero />
        <ScrollRevealParagraph />
        <HowItWorks />
        <InAction showCta />
        <Stats />
      </main>
      <Footer />
    </div>
  );
}
