interface SearchPattern {
  test: RegExp;
  buildQuery: (claimText: string) => string;
}

// Ordered by specificity — the first pattern whose keywords appear in the verify-step text wins.
const PATTERNS: SearchPattern[] = [
  {
    test: /government|official (record|website|source|statement|data)|\.gov\b/i,
    buildQuery: (c) => `${c} site:.gov`,
  },
  {
    test: /(who|world health organization|cdc|health authorit|medical association)/i,
    buildQuery: (c) => `${c} site:who.int OR site:cdc.gov`,
  },
  {
    test: /peer.?review|academic|systematic review|meta-analys|scientific (stud|research)|research (paper|study)/i,
    buildQuery: (c) => `${c} study site:.edu OR site:.gov`,
  },
  {
    test: /fact.?check/i,
    buildQuery: (c) => `${c} fact check`,
  },
  {
    test: /news (outlet|source|coverage|article)|reputable news|major news|journalis/i,
    buildQuery: (c) => `${c} news`,
  },
  {
    test: /primary source|original (document|record|study|source)/i,
    buildQuery: (c) => `${c} original source`,
  },
];

/** Builds a targeted Google search URL for a "verify this yourself" step, using the item's own wording to pick a relevant site: filter. */
export function buildVerifySearchUrl(item: string, claimText: string): string {
  const pattern = PATTERNS.find((p) => p.test.test(item));
  const query = pattern ? pattern.buildQuery(claimText) : claimText;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
