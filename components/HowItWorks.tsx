"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { STEPS } from "@/lib/steps";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function HowItWorks() {
  const preview = STEPS.slice(0, 3);

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            How TRACE works
          </h2>
          <p className="mt-3 text-lg text-ink/65">
            Six steps that turn a claim into a transparent, checkable
            investigation. Here&rsquo;s how it starts.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {preview.map(({ icon: Icon, label, description }, i) => (
            <motion.div
              key={label}
              variants={item}
              className="flex flex-col items-start gap-3 rounded-2xl border-2 border-ink/10 bg-white p-6"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-teal bg-cream text-teal">
                <Icon size={24} strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-coral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold text-ink">{label}</h3>
                </div>
                <p className="mt-1 text-sm leading-snug text-ink/60">{description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <Link
            href="/how-it-works"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-teal transition-colors hover:text-teal-dark"
          >
            See the full process
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
