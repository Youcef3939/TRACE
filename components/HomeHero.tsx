"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #0F6E56 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl"
        >
          Your guide through the{" "}
          <span className="text-teal">information noise</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-lg text-ink/70 sm:text-xl"
        >
          TRACE walks you through the evidence so you can investigate a claim
          yourself, instead of just being handed a verdict.
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
