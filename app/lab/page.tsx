import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LabGame from "@/components/lab/LabGame";

export const metadata: Metadata = {
  title: "The Lab — TRACE",
  description: "Practice your Media and Information Literacy skills in The Lab.",
};

export default function LabPage() {
  return (
    <div className="flex flex-1 flex-col bg-cream min-h-screen">
      <Nav />
      <main className="flex-1 flex flex-col">
        <LabGame />
      </main>
      <Footer />
    </div>
  );
}
