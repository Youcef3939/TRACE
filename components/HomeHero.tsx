"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BlurText from "@/components/BlurText";
import RotatingText from "@/components/RotatingText";

const ROTATING_CLAIMS = [
  "viral claims",
  "misleading headlines",
  "fake screenshots",
  "out-of-context quotes",
  "AI-generated content",
];

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15,110,86,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #0F6E56 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div
          role="heading"
          aria-level={1}
          className="flex flex-wrap items-baseline justify-center gap-x-2 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          <BlurText
            text="When truth is lost,"
            delay={80}
            animateBy="words"
            direction="top"
            className="text-ink"
          />
          <BlurText
            text="TRACE your steps"
            delay={80}
            startDelay={500}
            animateBy="words"
            direction="top"
            className="text-teal"
          />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-lg text-ink/70 sm:text-xl"
        >
          Traditional fact-checkers tell you what to think. We show you how.
          Don&rsquo;t just take our word for it, investigate{" "}
          <RotatingText
            texts={ROTATING_CLAIMS}
            rotationInterval={2500}
            staggerDuration={0.015}
            splitBy="characters"
            mainClassName="inline-flex text-teal font-semibold"
          />{" "}
          yourself.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10"
        >
          <Link
            href="/investigate"
            className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-base font-semibold text-cream transition-colors hover:bg-[#c14e26]"
          >
            Start an investigation
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
