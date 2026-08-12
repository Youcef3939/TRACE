import { extractClaims } from './extractClaims';
import { traceSource } from './traceSource';
import { retrieveEvidence } from './retrieveEvidence';
import { assess } from './assess';
import type { Investigation, Claim } from '@/types/trace';

const MAX_CLAIMS = 2;

export async function runInvestigation(
  input: string,
  language: 'en' | 'fr' | 'ar' = 'en'
): Promise<Investigation> {
  const extractedClaims = await extractClaims(input);
  const claimsToProcess = extractedClaims.slice(0, MAX_CLAIMS);
  const capped = extractedClaims.length > MAX_CLAIMS;

  const claims: Claim[] = await Promise.all(
    claimsToProcess.map(async (extractedClaim): Promise<Claim> => {
      const [sourceTrace, rawEvidence] = await Promise.all([
        traceSource(extractedClaim),
        retrieveEvidence(extractedClaim),
      ]);

      const { assessment, evidence, verifyYourself } = await assess(extractedClaim, rawEvidence);

      return {
        id: crypto.randomUUID(),
        text: extractedClaim.text,
        originalContext: extractedClaim.originalContext,
        sourceTrace,
        evidence,
        assessment,
        verifyYourself,
      };
    })
  );

  return {
    id: crypto.randomUUID(),
    input: {
      type: 'text',
      raw: input,
      language,
    },
    claims,
    createdAt: new Date(),
    totalClaimsFound: extractedClaims.length,
    claimsCapped: capped,
    capNotice: capped
      ? `This text contained ${extractedClaims.length} checkable claims. To keep this investigation fast, TRACE looked closely at the first ${MAX_CLAIMS}.`
      : null,
  };
}
