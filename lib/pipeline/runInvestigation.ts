import { extractClaims, type ExtractedClaim } from './extractClaims';
import { traceSource } from './traceSource';
import { retrieveEvidence, type RawEvidenceItem } from './retrieveEvidence';
import { assess } from './assess';
import type { Investigation, Claim, SourceTrace } from '@/types/trace';

const MAX_CLAIMS = 2;

export type ProgressEvent =
  | { stage: 'extract'; status: 'done'; data: { claims: ExtractedClaim[] } }
  | { stage: 'extract'; status: 'error'; error: string }
  | { stage: 'trace_source'; status: 'done'; claimIndex: number; data: SourceTrace }
  | { stage: 'trace_source'; status: 'error'; claimIndex: number; error: string }
  | { stage: 'retrieve_evidence'; status: 'done'; claimIndex: number; data: RawEvidenceItem[] }
  | { stage: 'retrieve_evidence'; status: 'error'; claimIndex: number; error: string }
  | { stage: 'assess'; status: 'done'; claimIndex: number; data: Claim }
  | { stage: 'assess'; status: 'error'; claimIndex: number; error: string }
  | { stage: 'complete'; data: Investigation }
  | { stage: 'fatal'; error: string };

type Settled<V> = { ok: true; value: V } | { ok: false; error: string };

async function* raceTraceAndEvidence(
  tracePromise: Promise<SourceTrace>,
  evidencePromise: Promise<RawEvidenceItem[]>
): AsyncGenerator<({ tag: 'trace_source' } & Settled<SourceTrace>) | ({ tag: 'retrieve_evidence' } & Settled<RawEvidenceItem[]>)> {
  const wrapTrace = tracePromise
    .then((value): Settled<SourceTrace> => ({ ok: true, value }))
    .catch((err): Settled<SourceTrace> => ({ ok: false, error: String(err) }))
    .then((settled) => ({ tag: 'trace_source' as const, ...settled }));

  const wrapEvidence = evidencePromise
    .then((value): Settled<RawEvidenceItem[]> => ({ ok: true, value }))
    .catch((err): Settled<RawEvidenceItem[]> => ({ ok: false, error: String(err) }))
    .then((settled) => ({ tag: 'retrieve_evidence' as const, ...settled }));

  const remaining = new Map<'trace_source' | 'retrieve_evidence', Promise<{ tag: 'trace_source' | 'retrieve_evidence' }>>([
    ['trace_source', wrapTrace],
    ['retrieve_evidence', wrapEvidence],
  ]);

  while (remaining.size > 0) {
    const winner = await Promise.race(remaining.values());
    remaining.delete(winner.tag);
    yield winner as Awaited<typeof wrapTrace> | Awaited<typeof wrapEvidence>;
  }
}

export async function* runInvestigation(
  input: string,
  language: 'en' | 'fr' | 'ar' = 'en'
): AsyncGenerator<ProgressEvent, void, unknown> {
  let extractedClaims: ExtractedClaim[];
  try {
    extractedClaims = await extractClaims(input);
  } catch (e) {
    yield { stage: 'extract', status: 'error', error: String(e) };
    return;
  }
  yield { stage: 'extract', status: 'done', data: { claims: extractedClaims } };

  const claimsToProcess = extractedClaims.slice(0, MAX_CLAIMS);
  const capped = extractedClaims.length > MAX_CLAIMS;
  const claims: Claim[] = [];

  for (let i = 0; i < claimsToProcess.length; i++) {
    const extractedClaim = claimsToProcess[i];

    let sourceTrace: SourceTrace = { confidence: 'unknown' };
    let rawEvidence: RawEvidenceItem[] = [];

    const settled = raceTraceAndEvidence(traceSource(extractedClaim), retrieveEvidence(extractedClaim));

    for await (const outcome of settled) {
      if (outcome.tag === 'trace_source') {
        if (outcome.ok) {
          sourceTrace = outcome.value;
          yield { stage: 'trace_source', status: 'done', claimIndex: i, data: sourceTrace };
        } else {
          yield { stage: 'trace_source', status: 'error', claimIndex: i, error: outcome.error };
        }
      } else {
        if (outcome.ok) {
          rawEvidence = outcome.value;
          yield { stage: 'retrieve_evidence', status: 'done', claimIndex: i, data: rawEvidence };
        } else {
          yield { stage: 'retrieve_evidence', status: 'error', claimIndex: i, error: outcome.error };
        }
      }
    }

    try {
      const { assessment, evidence, verifyYourself } = await assess(extractedClaim, rawEvidence);
      const claim: Claim = {
        id: crypto.randomUUID(),
        text: extractedClaim.text,
        originalContext: extractedClaim.originalContext,
        sourceTrace,
        evidence,
        assessment,
        verifyYourself,
      };
      claims.push(claim);
      yield { stage: 'assess', status: 'done', claimIndex: i, data: claim };
    } catch (e) {
      yield { stage: 'assess', status: 'error', claimIndex: i, error: String(e) };
      claims.push({
        id: crypto.randomUUID(),
        text: extractedClaim.text,
        originalContext: extractedClaim.originalContext,
        sourceTrace,
        evidence: [],
        assessment: { label: 'unverifiable', reasoningChain: 'Assessment failed for this claim.', manipulationSignals: [] },
        verifyYourself: [],
      });
    }
  }

  const investigation: Investigation = {
    id: crypto.randomUUID(),
    input: { type: 'text', raw: input, language },
    claims,
    createdAt: new Date(),
    totalClaimsFound: extractedClaims.length,
    claimsCapped: capped,
    capNotice: capped
      ? `This text contained ${extractedClaims.length} checkable claims. To keep this investigation fast, TRACE looked closely at the first ${MAX_CLAIMS}.`
      : null,
  };

  yield { stage: 'complete', data: investigation };
}
