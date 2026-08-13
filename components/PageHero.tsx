"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function PageHero({
  title,
  description,
}: {
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <section className="bg-cream pt-24 pb-8 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl px-5 text-center sm:px-8"
      >
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
          {description}
        </p>
      </motion.div>
    </section>
  );
}
