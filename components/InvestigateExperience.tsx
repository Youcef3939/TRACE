"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import InAction from "@/components/InAction";

export default function InvestigateExperience() {
  const [hasResult, setHasResult] = useState(false);

  return (
    <>
      <Hero onInvestigate={() => setHasResult(true)} />

      <AnimatePresence>
        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <InAction />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
