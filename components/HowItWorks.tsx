"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { STEPS } from "@/lib/steps";
import AnimatedContent from "@/components/AnimatedContent";

export default function HowItWorks() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
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

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(({ icon: Icon, label, description }, i) => (
            <AnimatedContent
              key={label}
              distance={24}
              direction="vertical"
              duration={0.5}
              delay={i * 0.1}
              threshold={0.1}
            >
              <div className="flex flex-col items-start gap-3 rounded-2xl border-2 border-ink/10 bg-white p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-teal bg-cream text-teal">
                  <Icon size={24} strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-coral">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold text-ink">{label}</h3>
                  </div>
                  <p className="mt-1 text-sm leading-snug text-ink/60">{description}</p>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Full process is shown above */}
      </div>
    </section>
  );
}
