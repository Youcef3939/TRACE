export interface SignalCategory {
  key: string;
  label: string;
  description: string;
  match: (signal: string) => boolean;
  patterns: RegExp[];
}

const SIGNAL_CATEGORIES: SignalCategory[] = [
  {
    key: "absolute_language",
    label: "Absolute language",
    description:
      "Words like “always,” “never,” or “proven” assert certainty the evidence doesn't actually support.",
    match: (s) => /absolute|overgeneral|universal|exaggerat/i.test(s),
    patterns: [
      /\b(always|never|proven|guarantee(?:d|s)?|100%|completely|totally|undeniably|certainly|definitely|absolutely|everyone knows|no one|impossible)\b/gi,
    ],
  },
  {
    key: "emotional_framing",
    label: "Emotional framing",
    description: "Language built to provoke fear, anger, or urgency instead of informing you.",
    match: (s) => /emotion|fear|urgen|outrage/i.test(s),
    patterns: [
      /\b(shocking|terrifying|outrageous|urgent|before it'?s too late|they don'?t want you to know|secret|hidden truth)\b/gi,
    ],
  },
  {
    key: "missing_source",
    label: "Missing source",
    description: "The claim doesn't point to where its facts or numbers actually came from.",
    match: (s) => /missing source|no source|unsourced|lack.*source/i.test(s),
    patterns: [],
  },
  {
    key: "commercial_source",
    label: "Commercial source",
    description:
      "The evidence comes from someone selling or promoting what the claim is about, not an independent source.",
    match: (s) => /commercial|promotional|advertis/i.test(s),
    patterns: [],
  },
  {
    key: "out_of_context",
    label: "Out-of-context quote",
    description: "A true quote or fact shown without the surrounding information that gives it its real meaning.",
    match: (s) => /context|quote/i.test(s),
    patterns: [],
  },
  {
    key: "unverified_source",
    label: "Unverified source",
    description: "The source can't be confirmed as credible, authoritative, or even real.",
    match: (s) => /unverifie|anonymous|unreliable/i.test(s),
    patterns: [],
  },
  {
    key: "cherry_picking",
    label: "Cherry-picked evidence",
    description: "Only the data or studies that support the claim are shown, while contradicting evidence is left out.",
    match: (s) => /cherry|selective/i.test(s),
    patterns: [],
  },
];

const DEFAULT_DESCRIPTION = "A pattern in how this claim is framed that's worth questioning.";

function toTitleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function describeSignal(signal: string): { label: string; description: string } {
  const found = SIGNAL_CATEGORIES.find((c) => c.match(signal));
  if (found) return { label: found.label, description: found.description };
  return { label: toTitleCase(signal), description: DEFAULT_DESCRIPTION };
}

export function categoriesForSignals(signals: string[]): SignalCategory[] {
  const seen = new Set<string>();
  const found: SignalCategory[] = [];
  for (const s of signals) {
    const cat = SIGNAL_CATEGORIES.find((c) => c.match(s));
    if (cat && !seen.has(cat.key)) {
      seen.add(cat.key);
      found.push(cat);
    }
  }
  return found;
}
