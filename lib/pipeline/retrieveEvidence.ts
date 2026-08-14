import { searchWeb } from '@/lib/tavily';
import type { ExtractedClaim } from './extractClaims';

export interface RawEvidenceItem {
  sourceUrl: string;
  sourceName: string;
  content: string;
}

export async function retrieveEvidence(claim: ExtractedClaim): Promise<RawEvidenceItem[]> {
  let searchResults;
  try {
    searchResults = await searchWeb(claim.searchQuery, 'advanced', 5);
  } catch (e) {
    console.error('retrieveEvidence: search failed:', e);
    return [];
  }

  const results = searchResults.results ?? [];

  return results.map((r: { title: string; url: string; content: string }) => ({
    sourceUrl: r.url,
    sourceName: r.title,
    content: r.content,
  }));
}
