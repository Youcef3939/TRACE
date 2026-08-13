"use client";

import { motion } from "framer-motion";

/**
 * One consistent line-art system for every /investigate visual: teal (#0F6E56) strokes, coral
 * (#D85A30) accents, flat geometry, round joins/caps — the same vocabulary as the TRACE logo
 * (magnifying glass + thread-and-nodes). All motion goes through framer-motion so it automatically
 * respects prefers-reduced-motion via the MotionConfig set up in app/layout.tsx.
 */

const TEAL = "#0F6E56";
const CORAL = "#D85A30";

export type StageStatus = "locked" | "active" | "done" | "error";

interface GlyphProps {
  size?: number;
  className?: string;
}

interface StageGlyphProps extends GlyphProps {
  status: StageStatus;
}

/** Small checkmark badge that pops onto the corner of a stage icon the moment it settles into "done". */
export function DoneMark({ size = 13 }: { size?: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className="absolute -right-1 -bottom-1"
    >
      <circle cx="12" cy="12" r="11" fill={TEAL} stroke="white" strokeWidth="2" />
      <path d="M7 12.5l3 3 7-7" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function ExtractGlyph({ status, size = 16, className }: StageGlyphProps) {
  const color = status === "error" ? CORAL : status === "locked" ? "#9CA6A1" : TEAL;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className}>
      <line x1="4" y1="11" x2="20" y2="11" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <line x1="4" y1="18" x2="16" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <line x1="4" y1="25" x2="19" y2="25" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <motion.g
        animate={status === "active" ? { x: [0, 3, 0, -3, 0] } : { x: 0 }}
        transition={{ duration: 1.8, repeat: status === "active" ? Infinity : 0, ease: "easeInOut" }}
      >
        <circle cx="25" cy="22" r="8" fill="none" stroke={color} strokeWidth="3" />
        <line x1="30.5" y1="27.5" x2="36" y2="33" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

export function TraceGlyph({ status, size = 16, className }: StageGlyphProps) {
  const color = status === "error" ? CORAL : status === "locked" ? "#9CA6A1" : TEAL;
  const points = [
    [6, 30],
    [16, 30],
    [24, 16],
    [34, 16],
  ];
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className}>
      <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={points[0][0]} cy={points[0][1]} r="4.5" fill={CORAL} />
      <circle cx={points[1][0]} cy={points[1][1]} r="3" fill={color} />
      <circle cx={points[2][0]} cy={points[2][1]} r="3" fill={color} />
      <circle cx={points[3][0]} cy={points[3][1]} r="3" fill={color} />
      {status === "active" && (
        <motion.circle
          r="2.6"
          fill="white"
          stroke={CORAL}
          strokeWidth="1.5"
          animate={{ cx: points.map((p) => p[0]), cy: points.map((p) => p[1]) }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

export function EvidenceGlyph({ status, size = 16, className }: StageGlyphProps) {
  const color = status === "error" ? CORAL : status === "locked" ? "#9CA6A1" : TEAL;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className}>
      <rect x="10" y="6" width="20" height="24" rx="2.5" fill="none" stroke={color} strokeWidth="2.5" opacity="0.35" />
      <rect x="7" y="10" width="20" height="24" rx="2.5" fill="none" stroke={color} strokeWidth="2.5" opacity="0.6" />
      <motion.g
        animate={status === "active" ? { y: [0, -1.5, 0] } : { y: 0 }}
        transition={{ duration: 1.4, repeat: status === "active" ? Infinity : 0, ease: "easeInOut" }}
      >
        <rect x="4" y="14" width="20" height="24" rx="2.5" fill="white" stroke={color} strokeWidth="3" />
        <line x1="9" y1="21" x2="19" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="26" x2="19" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="31" x2="15" y2="31" stroke={CORAL} strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

export function AssessGlyph({ status, size = 16, className }: StageGlyphProps) {
  const color = status === "error" ? CORAL : status === "locked" ? "#9CA6A1" : TEAL;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className}>
      <line x1="20" y1="8" x2="20" y2="32" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="14" y1="32" x2="26" y2="32" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <motion.g
        animate={status === "active" ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
        transition={{ duration: 2, repeat: status === "active" ? Infinity : 0, ease: "easeInOut" }}
        style={{ transformOrigin: "20px 8px" }}
      >
        <line x1="6" y1="12" x2="34" y2="12" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="6" y1="12" x2="6" y2="19" stroke={color} strokeWidth="2" />
        <line x1="34" y1="12" x2="34" y2="19" stroke={color} strokeWidth="2" />
        <path d="M2 19a4 4 0 0 0 8 0z" fill={CORAL} opacity="0.85" />
        <path d="M30 19a4 4 0 0 0 8 0z" fill={color} opacity="0.85" />
      </motion.g>
    </svg>
  );
}

export function GuessGateGlyph({ size = 44, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className}>
      <line x1="20" y1="30" x2="20" y2="22" stroke="#9CA6A1" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="22" x2="9" y2="10" stroke={TEAL} strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="22" x2="31" y2="10" stroke={CORAL} strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="30" r="4" fill="none" stroke="#9CA6A1" strokeWidth="2.5" />
      <motion.circle
        cx="9"
        cy="10"
        r="4.5"
        fill={TEAL}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="31"
        cy="10"
        r="4.5"
        fill={CORAL}
        animate={{ opacity: [1, 0.55, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function EmptyStateGlyph({ size = 30, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className}>
      <circle cx="17" cy="17" r="10" fill="none" stroke={TEAL} strokeWidth="3" />
      <line x1="13" y1="17" x2="21" y2="17" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <line x1="24.5" y1="24.5" x2="34" y2="34" stroke={TEAL} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function ErrorGlyph({ size = 28, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className}>
      <polyline points="6,28 15,28 21,17" fill="none" stroke={CORAL} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="27,17 33,17" fill="none" stroke={CORAL} strokeWidth="3" strokeLinecap="round" strokeDasharray="0.5 6" />
      <circle cx="6" cy="28" r="4" fill={CORAL} />
      <circle cx="33" cy="17" r="3" fill={CORAL} opacity="0.5" />
      <circle cx="21" cy="17" r="1.6" fill={CORAL} />
      <line x1="21" y1="24" x2="21" y2="29" stroke={CORAL} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="21" cy="32.5" r="1.4" fill={CORAL} />
    </svg>
  );
}

export function SearchLinkGlyph({ size = 13, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className}>
      <circle cx="17" cy="17" r="10" fill="none" stroke={TEAL} strokeWidth="4" />
      <line x1="24.5" y1="24.5" x2="34" y2="34" stroke={TEAL} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function IdleAccentGlyph({ size = 160, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <polyline points="10,60 30,60 45,38 70,38" stroke={TEAL} strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="10" cy="60" r="4" fill={CORAL} />
      <circle cx="30" cy="60" r="2.6" fill={TEAL} />
      <circle cx="45" cy="38" r="2.6" fill={TEAL} />
      <circle cx="70" cy="38" r="2.6" fill={TEAL} />
      <circle cx="70" cy="60" r="16" fill="none" stroke={TEAL} strokeWidth="2.5" />
      <line x1="81.5" y1="71.5" x2="92" y2="82" stroke={TEAL} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export type VerdictLabel = "well_supported" | "misleading" | "questionable" | "unverifiable" | "insufficient_evidence";

export function VerdictGlyph({ label, size = 16, className }: { label: VerdictLabel; size?: number; className?: string }) {
  const svgProps = { viewBox: "0 0 40 40", width: size, height: size, className };

  if (label === "well_supported") {
    return (
      <svg {...svgProps}>
        <path d="M20 5l13 5v10c0 9-6 16-13 20-7-4-13-11-13-20V10z" fill="none" stroke={TEAL} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M13.5 20l4.5 4.5 8.5-9" fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (label === "misleading") {
    return (
      <svg {...svgProps}>
        <polyline points="4,20 13,20" stroke={CORAL} strokeWidth="3.5" strokeLinecap="round" />
        <polyline points="27,20 36,20" stroke={CORAL} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="13" cy="20" r="2.3" fill={CORAL} />
        <circle cx="27" cy="20" r="2.3" fill={CORAL} />
        <line x1="17" y1="16" x2="23" y2="24" stroke={CORAL} strokeWidth="2.6" strokeLinecap="round" />
        <line x1="23" y1="16" x2="17" y2="24" stroke={CORAL} strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (label === "questionable") {
    return (
      <svg {...svgProps}>
        <path d="M13 15a7 7 0 1 1 10 6c-2 1.3-3 2.6-3 4.5" fill="none" stroke={CORAL} strokeWidth="3" strokeLinecap="round" />
        <circle cx="20" cy="31" r="2" fill={CORAL} />
      </svg>
    );
  }
  if (label === "unverifiable") {
    return (
      <svg {...svgProps}>
        <circle cx="20" cy="20" r="13" fill="none" stroke="#8A948F" strokeWidth="2.6" strokeDasharray="4 4" />
        <path d="M16 16a4 4 0 1 1 5.5 3.7c-1.3.8-1.9 1.6-1.9 2.8" fill="none" stroke="#8A948F" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="20" cy="26.5" r="1.5" fill="#8A948F" />
      </svg>
    );
  }
  // insufficient_evidence
  return (
    <svg {...svgProps}>
      <rect x="7" y="9" width="18" height="22" rx="2" fill="none" stroke="#8A948F" strokeWidth="2.4" strokeDasharray="3.5 3.5" />
      <line x1="12" y1="16" x2="20" y2="16" stroke="#8A948F" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="21" x2="18" y2="21" stroke="#8A948F" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
