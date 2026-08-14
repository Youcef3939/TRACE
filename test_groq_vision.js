const { generateText } = require("ai");
const { createGroq } = require("@ai-sdk/groq");
require("dotenv").config({ path: ".env.local" });

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    
    const { text } = await generateText({
      model: groq("llama-3.2-11b-vision-preview"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is this?" },
            { type: "image", image: Buffer.from(base64Data, "base64") },
          ],
        },
      ],
    });
    console.log("Success:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
