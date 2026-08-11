"use client";

import { useState } from "react";
import { ChevronDown, AlertTriangle, Globe, FlaskConical, Users } from "lucide-react";

const REASONING_STEPS = [
  {
    icon: Globe,
    title: "Source trace",
    text: "The claim traces back to a 2019 blog post with no cited research, later reshared without context on social media.",
  },
  {
    icon: FlaskConical,
    title: "Evidence check",
    text: "No peer-reviewed studies support the claim. Three independent oncology researchers found no causal mechanism.",
  },
  {
    icon: Users,
    title: "Consensus",
    text: "Major health authorities (WHO, national cancer institutes) explicitly list this claim as a documented myth.",
  },
];

export default function InAction() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            See TRACE in action
          </h2>
          <p className="mt-3 text-lg text-ink/65">
            A real investigation, start to finish — every step stays visible.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border-2 border-ink/10 bg-white">
          <div className="flex flex-col gap-4 border-b border-ink/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                Claim investigated
              </span>
              <p className="mt-1 text-xl font-semibold text-ink">
                &ldquo;Coffee cures cancer&rdquo;
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-coral/10 px-4 py-2 text-sm font-semibold text-coral">
              <AlertTriangle size={16} />
              Unsupported claim
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-teal transition-colors hover:bg-teal/5 sm:px-8 cursor-pointer"
            aria-expanded={open}
          >
            How we reached this
            <ChevronDown
              size={18}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="space-y-5 border-t border-ink/10 bg-teal/[0.03] px-6 py-6 sm:px-8">
              {REASONING_STEPS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                    <Icon size={17} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">{title}</h4>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink/65">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
