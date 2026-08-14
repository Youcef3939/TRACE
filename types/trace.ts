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
  totalClaimsFound: number;   
  claimsCapped: boolean;      
  capNotice: string | null;   
}

export interface Claim {
  id: string;
  text: string;               
  originalContext: string;   
  sourceTrace: SourceTrace | null;
  evidence: Evidence[];
  assessment: Assessment;
  verifyYourself: string[];   
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
  excerpt: string;            
  surroundingContext?: string; 
  credibilitySignal: 'primary_source' | 'reputable_reporting' | 'secondary' | 'unverified';
}

export interface Assessment {
  label: 'well_supported' | 'questionable' | 'misleading' | 'unverifiable' | 'insufficient_evidence';
  reasoningChain: string;      
  manipulationSignals: string[]; 
}

export interface AncestryHop {
  order: number;
  sourceName: string;
  approximateDate?: string;
  claimTextAtThisHop: string;
  changeFromPreviousHop?: string;
  confidence: 'confirmed' | 'inferred' | 'unknown';
}
