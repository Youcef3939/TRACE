import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Transparency from "@/components/Transparency";
import TeamSection from "@/components/TeamSection";

export const metadata: Metadata = {
  title: "About — TRACE",
  description:
    "TRACE is a two-person project built for the UNESCO Youth Hackathon 2026, focused on explainable media-literacy tooling.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <Nav />
      <main className="flex-1">
        <section className="bg-cream pt-24 pb-8 sm:pt-32">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              About TRACE
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
              Built by two people over a hackathon, with one goal: make
              verification something you can see, not just trust.
            </p>
          </div>
        </section>

        <section className="bg-cream pt-8 pb-12 sm:pt-12">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8 space-y-6 text-lg text-ink/75 leading-relaxed">
            <p>
              We started TRACE during the MIL Hackathon 2026 with a single, urgent realization: traditional fact-checking is losing the war against modern misinformation because it leaves the user passive. Lies spread fast because they are highly engineered for emotion, while the truth gets buried behind boring, black-box verdicts.
            </p>
            <p>
              Our platform is built to shift the power dynamic. TRACE pulls back the curtain on the anatomy of viral rumors, mapping out evidence out loud so young digital citizens can build permanent, unshakeable media literacy habits.
            </p>
          </div>
        </section>

        <TeamSection />
        <Transparency />

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-medium text-ink/70">
              Built for the UNESCO Youth Hackathon 2026
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
