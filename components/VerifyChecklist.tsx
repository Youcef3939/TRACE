"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export default function VerifyChecklist({ steps }: { steps: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => steps.map(() => false));

  const toggle = (i: number) => {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <ul className="space-y-1">
      {steps.map((step, i) => {
        const isChecked = checked[i];
        return (
          <li key={step}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={isChecked}
              className="group flex w-full items-start gap-2.5 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-ink/5 cursor-pointer"
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  isChecked ? "border-teal bg-teal" : "border-ink/25 bg-white group-hover:border-teal/50"
                }`}
              >
                <AnimatePresence>
                  {isChecked && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Check size={11} strokeWidth={3} className="text-cream" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span
                className={`text-sm transition-colors ${isChecked ? "text-ink/40 line-through" : "text-ink/70"}`}
              >
                {step}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
