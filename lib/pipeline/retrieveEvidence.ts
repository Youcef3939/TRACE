import { searchWeb } from '@/lib/tavily';
import type { ExtractedClaim } from './extractClaims';

export interface RawEvidenceItem {
  sourceUrl: string;
  sourceName: string;
  content: string;
}

/**
 * Retrieves candidate evidence for a claim. This stage is deliberately dumb: it only
 * fetches and shapes search results, it does NOT decide whether a source supports,
 * contradicts, or is merely discussing the claim. Labeling stance requires reading
 * and reasoning about the content, which belongs in assess.ts — conflating "this
 * source mentions the claim" with "this source supports the claim" here would bake
 * in the same misattribution risk traceSource.ts had to be fixed for.
 */
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
