import { NextResponse } from 'next/server';
import { generateObject, generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { uuidv4, z } from 'zod';
import { searchWeb } from '@/lib/tavily';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { input, language = 'en' } = await req.json();

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const investigationId = uuidv4();
    
    // 1. Claim Extraction
    const extractionPrompt = `
      You are an expert fact-checker and information literacy tutor.
      Extract the core, checkable factual claims from the following text.
      Ignore emotional framing, opinions, and rhetorical questions. 
      Focus only on assertions that can be verified with evidence.
      
      Text to analyze:
      "${input}"
    `;

    const extractionResult = await generateObject({
      model: groq('llama-3.1-70b-versatile'),
      schema: z.object({
        claims: z.array(z.object({
          text: z.string().describe('The extracted, checkable assertion'),
          originalContext: z.string().describe('The surrounding emotional or framed language it was pulled from'),
          searchQuery: z.string().describe('A precise, neutral search query to verify this claim on the web'),
        })).min(1).describe('List of claims extracted from the text'),
      }),
      prompt: extractionPrompt,
    });

    const claimsData = extractionResult.object.claims;
    const finalClaims = [];

    // Process each claim
    for (const claim of claimsData) {
      const claimId = uuidv4();

      // 2. Evidence Retrieval
      let searchResults;
      try {
        searchResults = await searchWeb(claim.searchQuery, 'advanced', 5);
      } catch (e) {
        console.error("Search failed:", e);
        searchResults = { results: [] };
      }

      const retrievedContext = searchResults.results.map((r: any) => 
        `Source: ${r.title} (${r.url})\nContent: ${r.raw_content || r.content}`
      ).join('\n\n');

      // 3 & 4 & 5 & 6: Assessment, Evidence Extraction, Verification steps
      const assessmentPrompt = `
        You are an expert truth investigator. Assess the following claim using ONLY the retrieved evidence.
        Do NOT rely on your internal knowledge. If the evidence is insufficient, state that.
        
        Claim: "${claim.text}"
        Original Context: "${claim.originalContext}"
        
        Retrieved Evidence:
        ${retrievedContext || 'No evidence found.'}
        
        Assess the claim, extract specific evidence snippets with their stance, and provide a reasoning chain.
        Also, provide 2-3 specific, actionable steps a user could take to verify this claim themselves next time.
      `;

      const assessmentResult = await generateObject({
        model: groq('llama-3.1-70b-versatile'),
        schema: z.object({
          assessment: z.object({
            label: z.enum(['well_supported', 'questionable', 'misleading', 'unverifiable', 'insufficient_evidence']),
            reasoningChain: z.string().describe('Human-readable walk-through of the reasoning (Claim -> Source -> Evidence -> Conclusion)'),
            manipulationSignals: z.array(z.string()).describe('Signals like "absolute language", "missing source", etc.'),
          }),
          evidence: z.array(z.object({
            sourceUrl: z.string(),
            sourceName: z.string(),
            stance: z.enum(['supports', 'contradicts', 'context', 'unrelated']),
            excerpt: z.string().describe('The specific relevant sentence/passage from the source'),
            surroundingContext: z.string().describe('A bit of surrounding text for Sourcing Sherlock context'),
            credibilitySignal: z.enum(['primary_source', 'reputable_reporting', 'secondary', 'unverified']),
          })),
          verifyYourself: z.array(z.string()).describe('Transferable verification steps for the user'),
          sourceTrace: z.object({
            originUrl: z.string().optional(),
            originAuthor: z.string().optional(),
            confidence: z.enum(['high', 'medium', 'low', 'unknown']),
          }).nullable()
        }),
        prompt: assessmentPrompt,
      });

      const processedClaim = {
        id: claimId,
        text: claim.text,
        originalContext: claim.originalContext,
        ...assessmentResult.object
      };
      
      finalClaims.push(processedClaim);

      // Save to Supabase (fire and forget for prototype)
      try {
        await supabase.from('claims').insert({
          id: claimId,
          investigation_id: investigationId,
          text: claim.text,
          original_context: claim.originalContext,
          verify_yourself: assessmentResult.object.verifyYourself,
          assessment_label: assessmentResult.object.assessment.label,
          assessment_reasoning_chain: assessmentResult.object.assessment.reasoningChain,
          assessment_manipulation_signals: assessmentResult.object.assessment.manipulationSignals,
          source_origin_url: assessmentResult.object.sourceTrace?.originUrl,
          source_origin_author: assessmentResult.object.sourceTrace?.originAuthor,
          source_confidence: assessmentResult.object.sourceTrace?.confidence || 'unknown'
        });

        if (assessmentResult.object.evidence.length > 0) {
          const evidenceRows = assessmentResult.object.evidence.map(e => ({
            claim_id: claimId,
            source_url: e.sourceUrl,
            source_name: e.sourceName,
            stance: e.stance,
            excerpt: e.excerpt,
            surrounding_context: e.surroundingContext,
            credibility_signal: e.credibilitySignal
          }));
          await supabase.from('evidence').insert(evidenceRows);
        }
      } catch (dbError) {
        console.error("Database insert error:", dbError);
      }
    }

    const investigationRecord = {
      id: investigationId,
      input: {
        type: 'text',
        raw: input,
        language
      },
      claims: finalClaims,
      createdAt: new Date(),
    };

    try {
      await supabase.from('investigations').insert({
        id: investigationId,
        input_type: 'text',
        input_raw: input,
        input_language: language
      });
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json(investigationRecord);

  } catch (error) {
    console.error("Investigation API error:", error);
    return NextResponse.json({ error: 'Failed to process investigation' }, { status: 500 });
  }
}
