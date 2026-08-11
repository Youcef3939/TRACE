import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
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
        <section className="bg-cream pt-24 pb-8 sm:pt-32">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              How TRACE works
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
              Six steps, start to finish. No hidden scoring — you&rsquo;ll
              see exactly why TRACE reaches the conclusion it does, at every
              stage along the way.
            </p>
          </div>
        </section>

        <StepWalkthrough />
      </main>
      <Footer />
    </div>
  );
}
