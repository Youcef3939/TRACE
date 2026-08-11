import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InvestigateExperience from "@/components/InvestigateExperience";

export const metadata: Metadata = {
  title: "Investigate — TRACE",
  description:
    "Paste a claim or a link and watch TRACE walk through the evidence, step by step.",
};

export default function InvestigatePage() {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <Nav />
      <main className="flex-1">
        <InvestigateExperience />
      </main>
      <Footer />
    </div>
  );
}
