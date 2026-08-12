import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { z } from 'zod';
import { searchWeb } from '@/lib/tavily';
import type { ExtractedClaim } from './extractClaims';
import type { SourceTrace } from '@/types/trace';

const SourceTraceSchema = z.object({
  originUrl: z.string().nullable().describe('Best-guess URL of where the claim first appeared, if identifiable from the search results. Null if not identifiable.'),
  originAuthor: z.string().nullable().describe('Author or publisher of the earliest identifiable source, if known. Null if not identifiable.'),
  originPublishDate: z.string().nullable().describe('Approximate publish date of the earliest identifiable source, if known. Null if not identifiable.'),
  publicationTrackRecord: z.string().nullable().describe('One short sentence on the reliability/track record of that origin, if it can be assessed from the results. Null if not assessable.'),
  confidence: z.enum(['high', 'medium', 'low', 'unknown']).describe(
    'How confident this origin trace actually is. Use "low" or "unknown" whenever the search results are thin, generic, or do not clearly show a first-appearance source — do not guess an origin just to fill the field.'
  ),
});

export async function traceSource(claim: ExtractedClaim): Promise<SourceTrace> {
  let searchResults;
  try {
    searchResults = await searchWeb(`${claim.searchQuery} origin OR first reported OR earliest`, 'basic', 5);
  } catch (e) {
    console.error('traceSource: search failed:', e);
    searchResults = { results: [] };
  }

  const results = searchResults.results ?? [];
  const retrievedContext = results
    .map((r: { title: string; url: string; content: string }) => `Source: ${r.title} (${r.url})\nSnippet: ${r.content}`)
    .join('\n\n');

  if (!retrievedContext) {
    return {
      confidence: 'unknown',
    };
  }

  const prompt = `
    You are investigating where a claim likely originated and how it has spread.

    Claim: "${claim.text}"
    Original context it appeared in: "${claim.originalContext}"

    Search results (these are NOT guaranteed to contain the true origin — they are just what a web search for this claim surfaced):
    ${retrievedContext}

    Critical distinction — read carefully before answering:
    - An ORIGIN source is one that appears to be where the claim was first made, posted, or spread (e.g. the original blog post,
      social media post, video, or article that asserts the claim).
    - A DISCUSSION/DEBUNK source is one that reports on, analyzes, fact-checks, or debunks the claim — for example a news article,
      fact-checking site, health authority, or charity explaining why the claim is true/false/a known myth. These sources are
      talking ABOUT the claim, they are not the place the claim came from.
    - Fact-checking organizations, health/science authorities, and news outlets covering a claim are almost always DISCUSSION
      sources, not origins. Never label a source as the origin just because it is topically relevant or highly ranked — check
      whether it is asserting the claim as true (possible origin) or examining/rebutting it (not an origin).

    Based ONLY on these search results, try to identify the most likely ORIGIN of this claim (earliest identifiable source that
    actually asserts it, its author, approximate date) and briefly note that source's track record if you can tell anything about it.

    If the search results only contain DISCUSSION/DEBUNK sources and no source that plausibly originated the claim, do NOT guess —
    leave all origin fields null and set confidence to "low" or "unknown". A rebuttal or fact-check article must never be reported
    as the origin, even if it's the only relevant result you found.

    Only use "high" confidence if a specific asserting (non-debunking) source is clearly and repeatedly identifiable as the earliest
    one across the results. Use "medium" only when there's a plausible but not fully certain asserting source. Use "low"/"unknown"
    whenever you're relying on discussion/debunk sources or the results are thin or generic.
  `;

  const result = await generateObject({
    model: groq('openai/gpt-oss-120b'),
    schema: SourceTraceSchema,
    prompt,
  });

  const { originUrl, originAuthor, originPublishDate, publicationTrackRecord, confidence } = result.object;
  return {
    originUrl: originUrl ?? undefined,
    originAuthor: originAuthor ?? undefined,
    originPublishDate: originPublishDate ?? undefined,
    publicationTrackRecord: publicationTrackRecord ?? undefined,
    confidence,
  };
}
