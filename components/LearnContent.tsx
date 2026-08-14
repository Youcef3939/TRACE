"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageHero from "./PageHero";
import {
  Megaphone,
  FileQuestion,
  Quote,
  HeartCrack,
  Bot,
  ArrowRight,
} from "lucide-react";

const SIGNALS = [
  {
    icon: Megaphone,
    title: "Absolute language",
    text: "Words like \"always,\" \"never,\" \"proven,\" or \"everyone knows\" are doing more persuading than the evidence itself. Real findings are usually qualified, conditional, and boring by comparison.",
  },
  {
    icon: FileQuestion,
    title: "Missing sources",
    text: "If a claim can't point to where its numbers or facts came from, treat it as a starting point for questions, not an answer. \"Studies show\" without a study is not a source.",
  },
  {
    icon: Quote,
    title: "Out-of-context quotes",
    text: "A true quote can still mislead if it's been cut from the sentence, paragraph, or moment that gave it meaning. Ask what came right before and after.",
  },
  {
    icon: HeartCrack,
    title: "Emotional framing",
    text: "Content engineered to make you angry, afraid, or vindicated spreads faster than content that just informs you. Notice the feeling first, then ask what it's doing to your judgment.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function LearnContent() {
  return (
    <>
      <PageHero
        title="Spot it before you share it"
        description={
          <>
            You don&rsquo;t need a tool to catch most manipulation, you need
            to know what to look for. Here&rsquo;s where to start.
          </>
        }
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            How to spot manipulation
          </motion.h2>

          <motion.div
            className="mt-10 grid gap-6 sm:grid-cols-2"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {SIGNALS.map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="rounded-2xl border-2 border-ink/10 bg-white p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/10 text-coral">
              <Bot size={20} />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Why verification is hard now
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              It used to be enough to check whether a photo looked edited or
              a quote sounded plausible. AI-generated text, images, and video
              have moved that bar, content can now look polished,
              well-sourced, and confident while being entirely fabricated.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              That doesn&rsquo;t mean verification is impossible, it means
              the old shortcuts (does it look real? does it sound
              credible?) matter less than they used to. What still works is
              slower and less glamorous: tracing a claim back to its
              origin, checking whether independent sources agree, and being
              honest with yourself about whether you actually looked, or
              just felt convinced.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mx-auto max-w-2xl px-5 text-center sm:px-8"
        >
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Ready to practice?
          </h2>
          <p className="mt-3 text-lg text-ink/65">
            Try TRACE on a real claim and see the reasoning for yourself.
          </p>
          <Link
            href="/investigate"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-base font-semibold text-cream transition-colors hover:bg-[#c14e26]"
          >
            Try TRACE
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </>
  );
}
