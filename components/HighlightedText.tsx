"use client";

import { Fragment, type ReactNode } from "react";
import InfoTooltip from "./InfoTooltip";
import { categoriesForSignals, type SignalCategory } from "@/lib/manipulationSignals";

interface Match {
  start: number;
  end: number;
  category: SignalCategory;
}

export default function HighlightedText({ text, signals }: { text: string; signals: string[] }) {
  const categories = categoriesForSignals(signals).filter((c) => c.patterns.length > 0);
  if (categories.length === 0) return <>{text}</>;

  const matches: Match[] = [];
  for (const category of categories) {
    for (const pattern of category.patterns) {
      const re = new RegExp(pattern.source, pattern.flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        matches.push({ start: m.index, end: m.index + m[0].length, category });
        if (m[0].length === 0) re.lastIndex++; // avoid infinite loop on zero-width matches
      }
    }
  }
  if (matches.length === 0) return <>{text}</>;

  matches.sort((a, b) => a.start - b.start);
  const nonOverlapping: Match[] = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.end;
    }
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  nonOverlapping.forEach((m, i) => {
    if (m.start > cursor) parts.push(<Fragment key={`t-${i}`}>{text.slice(cursor, m.start)}</Fragment>);
    parts.push(
      <InfoTooltip key={`h-${i}`} label={m.category.label} description={m.category.description}>
        <mark className="cursor-help rounded bg-coral/15 px-0.5 text-inherit decoration-coral decoration-2 underline-offset-2 hover:bg-coral/25">
          {text.slice(m.start, m.end)}
        </mark>
      </InfoTooltip>
    );
    cursor = m.end;
  });
  if (cursor < text.length) parts.push(<Fragment key="t-last">{text.slice(cursor)}</Fragment>);

  return <>{parts}</>;
}
