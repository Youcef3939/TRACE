export interface Investigation {
  id: string;
  input: {
    type: 'text' | 'url' | 'image' | 'social_post';
    raw: string;
    language: 'en' | 'fr' | 'ar';
  };
  claims: Claim[];
  createdAt: Date;
  userId?: string;
  totalClaimsFound: number;   // how many checkable claims extraction found, before any cap was applied
  claimsCapped: boolean;      // true if totalClaimsFound > claims.length
  capNotice: string | null;   // UI-facing copy explaining the cap, null when not capped
}

export interface Claim {
  id: string;
  text: string;               // the extracted, checkable assertion
  originalContext: string;    // the surrounding framing/emotional language it was pulled from
  sourceTrace: SourceTrace | null;
  evidence: Evidence[];
  assessment: Assessment;
  verifyYourself: string[];   // transferable verification steps
  ancestryChain?: AncestryHop[];
}

export interface SourceTrace {
  originUrl?: string;
  originAuthor?: string;
  originPublishDate?: string;
  publicationTrackRecord?: string;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
}

export interface Evidence {
  id: string;
  sourceUrl: string;
  sourceName: string;
  publishDate?: string;
  stance: 'supports' | 'contradicts' | 'context' | 'unrelated';
  excerpt: string;            // the specific relevant sentence/passage, not the whole article
  surroundingContext?: string; // surrounding text for Sourcing Sherlock
  credibilitySignal: 'primary_source' | 'reputable_reporting' | 'secondary' | 'unverified';
}

export interface Assessment {
  label: 'well_supported' | 'questionable' | 'misleading' | 'unverifiable' | 'insufficient_evidence';
  reasoningChain: string;      // human-readable walk-through, claim → source → evidence → context → conclusion
  manipulationSignals: string[]; // e.g. "absolute language", "missing source", "context stripped"
}

export interface AncestryHop {
  order: number;
  sourceName: string;
  approximateDate?: string;
  claimTextAtThisHop: string;
  changeFromPreviousHop?: string; // null for the first hop
  confidence: 'confirmed' | 'inferred' | 'unknown';
}
