"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What is TRACE?",
    answer: "TRACE is a comprehensive platform designed to combat misinformation. It provides powerful investigation tools and an interactive training ground called The Lab to help users develop critical media literacy skills."
  },
  {
    question: "How does The Lab work?",
    answer: "The Lab is a gamified experience where you evaluate real-world claims. Instead of telling you the answer, our AI evaluates your reasoning and the credibility of the sources you provide, teaching you how to think like an investigator."
  },
  {
    question: "Is TRACE free to use?",
    answer: "Yes, TRACE is completely free. Our mission is to make media literacy accessible to everyone, empowering individuals to verify information independently."
  },
  {
    question: "Who evaluates my investigations in The Lab?",
    answer: "We use advanced Large Language Models (LLMs) that are specifically prompted to check your logic against verified ground truth. The AI does not browse the web in real-time, but it analyzes your reasoning and the plausibility of your provided source URLs."
  },
  {
    question: "Can I use TRACE on my mobile phone?",
    answer: "Absolutely. The entire TRACE platform, including the investigation tools and The Lab, is fully responsive and optimized for a seamless mobile experience."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 text-lg text-ink/70"
          >
            Everything you need to know about the platform and how it works.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                className={`overflow-hidden rounded-2xl border-2 transition-colors duration-300 ${isOpen ? 'border-teal bg-white shadow-sm' : 'border-ink/10 bg-white hover:border-ink/20'}`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left focus:outline-none"
                >
                  <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-teal' : 'text-ink'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-teal/10 text-teal' : 'bg-ink/5 text-ink/60'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-ink/70 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
