"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";

const STATS = [
  { value: 6, suffix: "", label: "steps per investigation" },
  { value: 3, suffix: "", label: "languages supported" },
  { value: 0, suffix: "", label: "black-box scores" },
  { value: 100, suffix: "%", label: "of reasoning shown" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Stats() {
  return (
    <section className="border-y border-ink/10 bg-cream py-16 sm:py-20">
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-5 sm:px-8 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        {STATS.map((stat) => (
          <motion.div key={stat.label} variants={item} className="text-center lg:text-left">
            <div className="text-5xl font-bold tracking-tight text-teal sm:text-6xl">
              <CountUp to={stat.value} suffix={stat.suffix} duration={1.4} />
            </div>
            <div className="mt-2 text-sm font-medium text-ink/55">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
