"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Search, FileSearch, Scale } from "lucide-react";

export default function InAction({ showCta = false }: { showCta?: boolean }) {
  return (
    <section className="bg-cream py-24 sm:py-32 text-ink">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          className="mb-12 mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            See TRACE in action
          </h2>
          <p className="mt-3 text-lg text-ink/65">
            A real investigation, start to finish, every step stays visible, transparent, and auditable.
          </p>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-3xl border-2 border-ink/10 bg-white shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col gap-4 border-b border-ink/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 bg-white">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-ink/40">
                {"// TARGET_CLAIM_ID: 982A-F3"}
              </span>
              <p className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                &ldquo;Drinking coffee cures stage 4 cancer within weeks.&rdquo;
              </p>
            </div>
            <div className="shrink-0 self-start sm:self-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-4 py-2 text-sm font-bold text-coral">
                <AlertTriangle size={16} strokeWidth={2.5} />
                Unsupported Claim
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="relative border-l-2 border-ink/10 pl-6 space-y-10 sm:space-y-12">
              
              <div className="relative">
                <div className="absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal text-white">
                  <Search size={14} strokeWidth={3} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-ink">Source tracing</h3>
                </div>
                <p className="text-sm leading-relaxed text-ink/70 max-w-2xl">
                  The claim traces back to a 2019 holistic wellness blog post with no cited medical research. It was later paraphrased and reshared out of context on Facebook.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal text-white">
                  <FileSearch size={14} strokeWidth={3} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-ink">Sourcing Sherlock Comparison</h3>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-ink/10 bg-cream/50 p-5">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/50">Viral Social Post</span>
                    <p className="text-sm italic text-ink/80">
                      &ldquo;A new breakthrough! Big Pharma is hiding this, but drinking 3 cups of coffee daily actually cures stage 4 cancer within weeks! ☕🧬&rdquo;
                    </p>
                  </div>
                  <div className="rounded-xl border border-ink/10 bg-cream/50 p-5 flex flex-col justify-between">
                    <div>
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-teal">Primary Source (Study)</span>
                      <p className="text-sm text-ink/80 leading-relaxed">
                        &ldquo;While coffee consumption shows potential antioxidant benefits, <span className="bg-coral/20 text-ink font-semibold px-1 rounded">there is no clinical evidence that it acts as a cure or viable treatment for any stage of cancer.</span> Patients should not replace prescribed treatments.&rdquo;
                      </p>
                    </div>
                    <a 
                      href="https://www.cancer.org/research/acs-research-news/coffee-and-cancer-what-the-research-really-shows.html" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-4 block text-xs font-bold text-teal hover:underline"
                    >
                      Full study here &rarr;
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal text-white">
                  <Scale size={14} strokeWidth={3} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-ink">Explainable Assessment</h3>
                </div>
                <p className="text-sm leading-relaxed text-ink/70 max-w-2xl">
                  Major health authorities explicitly list this claim as a documented myth. The viral post relies on absolute language (&ldquo;cures cancer&rdquo;) and artificial urgency (&ldquo;Big Pharma is hiding this&rdquo;) without providing a verifiable source.
                </p>
              </div>

            </div>
          </div>
        </motion.div>

        {showCta && (
          <motion.div 
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/investigate"
              className="group inline-flex items-center gap-3 text-base font-bold text-coral transition-colors hover:text-[#c14e26]"
            >
              Try it yourself
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/10 group-hover:bg-coral/20 transition-colors">
                <ArrowRight size={16} className="text-coral" />
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
