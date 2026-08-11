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
