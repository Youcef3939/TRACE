"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TEAM = [
  { 
    name: "Hamdi Belhaj", 
    image: "/hamdi.png",
    roles: [
      "Cloud and cybersecurity engineering student",
      "7 years journalist @ maktaris news",
      "3 years web developer and data journalist @ kashf media"
    ],
    github: "https://github.com/HamdiBelhaj0013",
    linkedin: "https://www.linkedin.com/in/hamdi-belhaj-163a80257/"
  },
  { 
    name: "Youcef Chalbi", 
    image: "/youcef.png",
    roles: [
      "Computer engineering student",
      "3 years journalist @ maktaris news",
      "Active open source contributor"
    ],
    github: "https://github.com/Youcef3939",
    linkedin: "https://www.linkedin.com/in/youcefchalbi/"
  },
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
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
          className="text-2xl font-bold tracking-tight text-ink text-center sm:text-3xl"
        >
          Meet the team
        </motion.h2>

        <motion.div
          className="mt-10 grid gap-8 md:grid-cols-2"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {TEAM.map(({ name, image, roles, github, linkedin }) => (
            <motion.div
              key={name}
              variants={item}
              className="flex flex-col gap-6 rounded-2xl border-2 border-ink/10 bg-white p-8 sm:flex-row"
            >
              <div className="shrink-0">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-ink/10 bg-cream">
                  <Image 
                    src={image} 
                    alt={name} 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-bold text-ink">{name}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
                    {roles.map((role, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal/60"></span>
                        <span className="leading-snug">{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex items-center gap-4 text-ink/40">
                  <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors" aria-label={`${name}'s GitHub`}>
                    <GithubIcon size={20} />
                  </a>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#0a66c2] transition-colors" aria-label={`${name}'s LinkedIn`}>
                    <LinkedinIcon size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
