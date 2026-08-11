"use client";

import ScrollReveal from "./ScrollReveal";

export default function ScrollRevealParagraph() {
  return (
    <section className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 space-y-16 sm:space-y-24 text-ink/80">
        
        <ScrollReveal
          baseOpacity={0.1}
          enableBlur={true}
          baseRotation={0}
          blurStrength={4}
          containerClassName="text-xl md:text-2xl"
          textClassName="text-ink/80"
        >
          Every day, your feed is flooded with half-truths, deepfakes, and highly engineered out-of-context headlines.
        </ScrollReveal>

        <ScrollReveal
          baseOpacity={0.1}
          enableBlur={true}
          baseRotation={0}
          blurStrength={4}
          containerClassName="text-xl md:text-2xl"
          textClassName="text-ink/80"
        >
          Traditional fact-checkers try to police the internet with single-word verdicts. They tell you what to believe, keep their process hidden in a black box, and leave you dependent on them.
        </ScrollReveal>

        <ScrollReveal
          baseOpacity={0.1}
          enableBlur={true}
          baseRotation={0}
          blurStrength={4}
          containerClassName="text-xl md:text-2xl"
          textClassName="text-ink/80"
        >
          We think that is broken. True Media and Information Literacy isn’t about trusting a new authority, it’s about giving you the tools to dismantle deception out loud.
        </ScrollReveal>

      </div>
    </section>
  );
}
