import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";
import { LAB_CLAIMS } from "@/lib/lab/claims";

export async function POST(req: Request) {
  try {
    const { claimId, source, userVerdict } = await req.json();

    const claim = LAB_CLAIMS.find((c) => c.id === claimId);
    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `
        You are evaluating a user in a Media and Information Literacy training game called TRACE Lab.
        
        CLAIM INFO:
        - Content: "${claim.content}"
        - Source Type: ${claim.type} (${claim.author})
        - Ground Truth Verdict: ${claim.groundTruthVerdict}
        - Explanation of Truth: ${claim.explanation}
        - Skill Practiced: ${claim.skill}

        USER SUBMISSION:
        - User's Verdict: ${userVerdict}
        - User's Source: ${source}

        INSTRUCTIONS:
        1. Check if the user's verdict is logically correct (it must match or be very close in meaning to the Ground Truth Verdict).
        2. Check if the user's source (URL) seems like it could plausibly support this conclusion. Since you cannot browse the web, just evaluate the URL string for plausibility and relevance.
        3. If BOTH the verdict is correct AND the source seems plausible, success is TRUE. Otherwise, success is FALSE.
        4. Provide a brief (2-3 sentences), educational explanation. 
           - If success is TRUE: Congratulate them, explain why the claim was correct/incorrect based on the ground truth, and mention how this relates to the skill of "${claim.skill}".
           - If success is FALSE: Gently explain why their conclusion was incorrect or unsupported, based on the ground truth explanation.

        OUTPUT FORMAT:
        You must return ONLY raw JSON, with no markdown formatting, no backticks, and no extra text.
        {
          "success": true or false,
          "explanation": "Your explanation here"
        }
      `,
    });

    let result;
    try {
      // Remove possible markdown formatting if the model disobeys
      const cleaned = text.replace(/^```json\\n?/, '').replace(/\\n?```$/, '').trim();
      result = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse JSON:", text);
      return NextResponse.json({ error: "Invalid evaluation format" }, { status: 500 });
    }

    return NextResponse.json({
      success: result.success,
      explanation: result.explanation,
      skillPracticed: claim.skill,
    });
  } catch (error) {
    console.error("[Lab Evaluation Error]", error);
    return NextResponse.json({ error: "Failed to evaluate" }, { status: 500 });
  }
}
