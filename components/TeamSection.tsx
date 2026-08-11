"use client";

import { motion } from "framer-motion";

const TEAM = [
  { name: "Hamdi Belhaj", role: "Co-builder" },
  { name: "Youcef Chalbi", role: "Co-builder" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function TeamSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
          className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          The team
        </motion.h2>

        <motion.div
          className="mt-8 grid gap-6 sm:grid-cols-2"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {TEAM.map(({ name, role }) => (
            <motion.div
              key={name}
              variants={item}
              className="flex items-center gap-4 rounded-2xl border-2 border-ink/10 bg-white p-6"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal/10 text-lg font-bold text-teal">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink">{name}</h3>
                <p className="text-sm text-ink/55">{role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
