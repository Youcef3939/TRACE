const key = process.argv[2];
if (!key) {
  console.error("Usage: node test-groq-key.js YOUR_KEY_HERE");
  process.exit(1);
}

fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: "hi" }],
    max_tokens: 5,
  }),
})
  .then(async (res) => {
    const text = await res.text();
    console.log("Status:", res.status);
    console.log(text);
  })
  .catch((err) => console.error("Error:", err.message));
