"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const RESOURCES = [
  {
    title: "New UNESCO issue brief global gaps in media and information literarcy policies and education",
    url: "https://www.unesco.org/en/articles/new-unesco-issue-brief-reveals-global-gaps-media-and-information-literacy-policies-and-education",
  },
  {
    title: "Media and information literarcy is first line of defence against disinformation",
    url: "https://www.unesco.org/en/articles/media-and-information-literacy-first-line-defence-against-disinformation",
  },
  {
    title: "UNESCO's innovative tools for media and information literarcy",
    url: "https://www.unesco.org/en/articles/unescos-innovative-tools-media-and-information-literacy",
  },
  {
    title: "Promoting MIL in Nepal",
    url: "https://www.unesco.org/en/articles/promoting-and-strengthening-media-and-information-literacy-mil-nepal",
  },
  {
    title: "UNESCO supports African broadcasters to develop MIL policies",
    url: "https://www.unesco.org/en/articles/unesco-strengthens-global-push-media-and-information-literacy-media",
  },
  {
    title: "UNESCO accelerates global piloting of MIL cities",
    url: "https://www.unesco.org/en/articles/unesco-accelerates-global-piloting-media-and-information-literacy-cities",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ResourcesPage() {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <Nav />
      <main className="flex-1">
        <section className="bg-cream pt-24 pb-8 sm:pt-32">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Media & Information Literacy Resources
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
              Explore official reports, tools, and updates from UNESCO to
              deepen your understanding of media literacy around the globe.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {RESOURCES.map((resource, index) => (
                <motion.a
                  key={index}
                  variants={item}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-2xl border-2 border-ink/10 bg-white p-6 transition-colors hover:border-teal/30"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                        UNESCO Article
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink/40 transition-colors group-hover:bg-teal/10 group-hover:text-teal">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold leading-tight text-ink group-hover:text-teal transition-colors">
                      {resource.title}
                    </h3>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
