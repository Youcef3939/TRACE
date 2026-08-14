import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import StepWalkthrough from "@/components/StepWalkthrough";

export const metadata: Metadata = {
  title: "How TRACE works",
  description:
    "A guided walkthrough of the six steps TRACE takes to turn a claim into a transparent, checkable investigation.",
};

export default function HowItWorksPage() {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <Nav />
      <main className="flex-1">
        <PageHero
          title="How TRACE works"
          description={
            <>
              Six steps, start to finish. No hidden scoring, you&rsquo;ll
              see exactly why TRACE reaches the conclusion it does, at every
              stage along the way.
            </>
          }
        />

        <StepWalkthrough />
      </main>
      <Footer />
    </div>
  );
}
