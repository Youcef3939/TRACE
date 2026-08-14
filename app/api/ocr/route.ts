import { NextResponse } from "next/server";
import { createWorker } from "tesseract.js";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();

    if (!text || !text.trim()) {
      return NextResponse.json({ text: "No legible text could be extracted from this image." });
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error("[OCR API] Error:", error);
    return NextResponse.json({ error: "Failed to extract text from image.", details: String(error) }, { status: 500 });
  }
}
