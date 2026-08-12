import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { z } from 'zod';
import type { ExtractedClaim } from './extractClaims';
import type { RawEvidenceItem } from './retrieveEvidence';
import type { Assessment, Evidence } from '@/types/trace';

const AssessmentResultSchema = z.object({
  assessment: z.object({
    label: z.enum(['well_supported', 'questionable', 'misleading', 'unverifiable', 'insufficient_evidence']),
    reasoningChain: z.string().describe(
      'Human-readable walk-through: Claim -> what the credible evidence actually shows -> how any low-credibility or contradicting ' +
      'sources were weighed -> Conclusion. If the claim is only "supported" by a low-credibility or commercial source while reputable ' +
      'sources contradict or are silent on it, say so explicitly and do not call the claim well_supported.'
    ),
    manipulationSignals: z.array(z.string()).describe('Signals like "absolute language", "missing source", "commercial/promotional source used as proof", etc.'),
  }),
  evidence: z.array(z.object({
    sourceUrl: z.string(),
    sourceName: z.string(),
    stance: z.enum(['supports', 'contradicts', 'context', 'unrelated']).describe(
      'Whether THIS SPECIFIC source, based on its actual content, supports, contradicts, or merely provides context on the claim. ' +
      'A source that just mentions or discusses the claim topic without taking a position is "context", not "supports".'
    ),
    excerpt: z.string().describe('The specific relevant sentence/passage from the source that justifies the stance'),
    surroundingContext: z.string().nullable().describe('A bit of surrounding text for additional context. Null if not needed.'),
    credibilitySignal: z.enum(['primary_source', 'reputable_reporting', 'secondary', 'unverified']).describe(
      'primary_source = original research/data/official record. reputable_reporting = established health authority, university, ' +
      'or major news outlet. secondary = general blog/indirect commentary with no clear authority. unverified = commercial/promotional ' +
      'source (e.g. a company selling the product the claim is about), anonymous, or otherwise untrustworthy.'
    ),
  })),
  verifyYourself: z.array(z.string()).describe('2-3 transferable verification steps a user could take themselves next time'),
});

export interface AssessResult {
  assessment: Assessment;
  evidence: Evidence[];
  verifyYourself: string[];
}

const MAX_CONTENT_CHARS_PER_SOURCE = 800;

export async function assess(claim: ExtractedClaim, rawEvidence: RawEvidenceItem[]): Promise<AssessResult> {
  const retrievedContext = rawEvidence.length
    ? rawEvidence
        .map(e => `Source: ${e.sourceName} (${e.sourceUrl})\nContent: ${e.content.slice(0, MAX_CONTENT_CHARS_PER_SOURCE)}`)
        .join('\n\n')
    : 'No evidence found.';

  const prompt = `
    You are an expert fact-checker. Assess the following claim using ONLY the retrieved evidence below. Do NOT rely on your
    internal knowledge to fill gaps — if the evidence is insufficient, say so.

    Claim: "${claim.text}"
    Original context it appeared in: "${claim.originalContext}"

    Retrieved evidence (raw search results — these have NOT been pre-screened for credibility or stance, you must judge that yourself):
    ${retrievedContext}

    Critical instructions on weighing evidence:
    - Judge each source's actual stance from its content. A source merely appearing in search results for this topic does not mean
      it supports the claim — read what it actually says.
    - Judge each source's credibility independently of its stance. A commercial or promotional source (e.g. a company's blog selling
      the product the claim is about) that happens to "support" the claim is NOT equivalent evidence to a reputable, independent
      source — credibility and stance are two separate judgments, don't let one leak into the other.
    - When forming the overall assessment, credible sources (primary_source / reputable_reporting) that contradict the claim should
      outweigh a single low-credibility or commercial source (secondary / unverified) that supports it. Do not average them as if
      they carry equal weight.
    - If the claim's only "support" comes from an unverified/commercial source while reputable sources are silent or contradict it,
      the label should reflect that (e.g. "misleading" or "questionable"), and the reasoning chain must explicitly call out that
      credibility gap — do not just say "mixed evidence".
    - If there is no real evidence either way, use "insufficient_evidence" or "unverifiable" rather than guessing.

    For each source you use as evidence, extract the specific relevant excerpt, its stance toward the claim, and its credibility signal.
    Then give an overall assessment with a plain-language reasoning chain, and 2-3 actionable steps a user could take to verify a
    similar claim themselves next time.
  `;

  const result = await generateObject({
    model: groq('openai/gpt-oss-120b'),
    schema: AssessmentResultSchema,
    prompt,
  });

  const { assessment, evidence, verifyYourself } = result.object;

  return {
    assessment,
    evidence: evidence.map(e => ({
      id: crypto.randomUUID(),
      sourceUrl: e.sourceUrl,
      sourceName: e.sourceName,
      stance: e.stance,
      excerpt: e.excerpt,
      surroundingContext: e.surroundingContext ?? undefined,
      credibilitySignal: e.credibilitySignal,
    })),
    verifyYourself,
  };
}
