"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function InfoTooltip({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [supportsHover] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [open]);

  return (
    <span
      ref={ref}
      className="relative inline-block"
      onMouseEnter={() => supportsHover && setOpen(true)}
      onMouseLeave={() => supportsHover && setOpen(false)}
    >
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          if (!supportsHover) setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        aria-label={`${label}: ${description}`}
      >
        {children}
      </span>
      {open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border border-ink/10 bg-ink px-3 py-2 text-xs leading-snug shadow-lg"
        >
          <span className="block font-semibold text-cream">{label}</span>
          <span className="mt-0.5 block text-cream/75">{description}</span>
        </span>
      )}
    </span>
  );
}
