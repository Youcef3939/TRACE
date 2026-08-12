import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { z } from 'zod';

export const ExtractedClaimSchema = z.object({
  text: z.string().describe('The extracted, checkable assertion, stated neutrally'),
  originalContext: z.string().describe('The surrounding emotional or framed language it was pulled from'),
  searchQuery: z.string().describe('A precise, neutral search query to verify this claim on the web'),
});

export type ExtractedClaim = z.infer<typeof ExtractedClaimSchema>;

const ExtractionResultSchema = z.object({
  claims: z.array(ExtractedClaimSchema).describe(
    'List of checkable factual claims found in the text. Empty array if the text contains no checkable claims (e.g. pure opinion, a question, a subjective statement).'
  ),
});

export async function extractClaims(input: string): Promise<ExtractedClaim[]> {
  const prompt = `
    You are an expert fact-checker. Extract the core, checkable factual claims from the text below.

    Rules:
    - Ignore emotional framing, opinions, rhetorical questions, and subjective statements ("I think...", "isn't it awful that...").
    - Only extract assertions that describe a state of the world that could in principle be verified or refuted with evidence.
    - If a claim is conditional or hedged (e.g. "some studies suggest X"), preserve that hedge in the claim text rather than stripping it into an absolute statement.
    - If the text contains no checkable claims at all, return an empty claims array. Do not invent a claim just to have one.
    - Keep each claim as a single, self-contained assertion — split compound claims into separate entries.

    Text to analyze:
    "${input}"
  `;

  const result = await generateObject({
    model: groq('openai/gpt-oss-120b'),
    schema: ExtractionResultSchema,
    prompt,
  });

  return result.object.claims;
}
