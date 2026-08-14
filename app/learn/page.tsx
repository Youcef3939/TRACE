import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LearnContent from "@/components/LearnContent";

export const metadata: Metadata = {
  title: "Learn - Media literacy basics",
  description:
    "Learn how to spot manipulation in what you read online, and why verification has gotten harder in the age of AI-generated content.",
};

export default function LearnPage() {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <Nav />
      <main className="flex-1">
        <LearnContent />
      </main>
      <Footer />
    </div>
  );
}
