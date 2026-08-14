"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function MasteryScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 max-w-2xl mx-auto my-auto h-full mt-24"
    >
      <div className="text-6xl mb-6">🕵️</div>
      <h1 className="text-4xl font-bold text-ink sm:text-5xl mb-6">MASTERY UNLOCKED!</h1>
      <p className="text-xl font-medium text-ink/80 mb-4 leading-relaxed">
        The ultimate weapon against misinformation isn't a smarter algorithm; it's an unshakeable mind.
      </p>
      <p className="text-lg text-ink/60 mb-12">
        You're ready now. Go spot those fake news!
      </p>
      <Link
        href="/investigate"
        className="group inline-flex items-center gap-3 text-base font-bold text-coral transition-colors hover:text-[#c14e26]"
      >
        GO INVESTIGATE SOMETHING REAL
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/10 group-hover:bg-coral/20 transition-colors">
          <ArrowRight size={16} className="text-coral" />
        </span>
      </Link>
    </motion.div>
  );
}
