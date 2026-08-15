import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";

export const maxDuration = 60;

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { imageBase64, query } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    const systemPrompt = query 
      ? "You are TRACE's visual analysis assistant. The user has uploaded an image and is asking a question about it. Answer their question based purely on what you can see in the image."
      : "Analyze the visual composition, identified objects, and written text simultaneously. Extract any readable text exactly as written. Then, provide a brief description of the scene or context (e.g., 'This is a news headline screenshot from a phone' or 'This is a meme with manipulated text'). Do not invent information not present in the image.";

    const userPrompt = query || "Extract text and analyze the visual scene.";

    const { text } = await generateText({
      model: groq("qwen/qwen3.6-27b"),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image", image: imageBuffer },
          ],
        },
      ],
      providerOptions: {
        groq: {
          reasoningFormat: "hidden",
          reasoningEffort: "none",
        },
      },
    });

    // Defense in depth: strip any <think> block that slips through, including
    // one truncated mid-thought (no closing tag) if generation got cut off.
    const cleanedText = text
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/<think>[\s\S]*$/gi, "")
      .trim();

    if (!cleanedText) {
      return NextResponse.json({ text: "No legible text or recognizable visual context could be extracted from this image." });
    }

    return NextResponse.json({ text: cleanedText });
  } catch (error) {
    console.error("[Vision API] Error:", error);
    return NextResponse.json({ error: "Failed to extract text from image.", details: String(error) }, { status: 500 });
  }
}
