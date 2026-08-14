"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";


export default function CountUp({
  to,
  from = 0,
  duration = 1.3,
  suffix = "",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = animate(from, to, {
      duration: prefersReducedMotion ? 0 : duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
