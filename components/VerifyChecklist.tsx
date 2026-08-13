"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { buildVerifySearchUrl } from "@/lib/verifySearch";
import { SearchLinkGlyph } from "./illustrations/StageIcons";

export default function VerifyChecklist({ steps, claimText }: { steps: string[]; claimText: string }) {
  const [checked, setChecked] = useState<boolean[]>(() => steps.map(() => false));

  const toggle = (i: number) => {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <ul className="space-y-1">
      {steps.map((step, i) => {
        const isChecked = checked[i];
        const searchUrl = buildVerifySearchUrl(step, claimText);
        return (
          <li key={step} className="flex flex-wrap items-start gap-x-1 gap-y-1.5 rounded-lg px-1 py-1.5">
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={isChecked}
              className="group flex flex-1 items-start gap-2.5 text-left cursor-pointer min-w-[60%]"
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
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ml-6 flex shrink-0 items-center gap-1.5 rounded-full border border-teal/30 bg-teal/5 px-2.5 py-1 text-xs font-semibold text-teal transition-colors hover:border-teal hover:bg-teal/10 cursor-pointer sm:ml-0"
            >
              <SearchLinkGlyph size={12} />
              Try it
            </a>
          </li>
        );
      })}
    </ul>
  );
}
