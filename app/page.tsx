import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import InAction from "@/components/InAction";
import Transparency from "@/components/Transparency";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <Nav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <InAction />
        <Transparency />
      </main>
      <Footer />
    </div>
  );
}
