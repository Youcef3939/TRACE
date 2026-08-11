"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/lib/steps";

export default function StepWalkthrough() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 sm:px-8 sm:pb-32">
      {STEPS.map(({ icon: Icon, label, detail, mockup }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className={`flex flex-col gap-8 py-14 sm:flex-row sm:gap-12 sm:py-20 ${
            i !== STEPS.length - 1 ? "border-b border-ink/10" : ""
          }`}
        >
          <div className="flex shrink-0 items-start gap-4 sm:w-64">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-teal bg-cream text-teal">
              <Icon size={24} strokeWidth={2} />
            </div>
            <div>
              <span className="text-xs font-semibold text-coral">
                Step {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">
                {label}
              </h2>
            </div>
          </div>

          <div className="flex-1">
            <p className="max-w-xl text-lg leading-relaxed text-ink/70">
              {detail}
            </p>

            <div className="mt-6 max-w-md rounded-xl border-2 border-ink/10 bg-white p-4 shadow-[0_2px_0_0_rgba(20,35,29,0.05)]">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-ink/35">
                {label} output
              </span>
              <p className="mt-1.5 text-sm font-medium text-ink/80">
                {mockup.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
