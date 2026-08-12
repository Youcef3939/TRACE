const fetch = require("node-fetch");
require("dotenv").config({ path: ".env.local" });

async function getModels() {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      }
    });
    const data = await res.json();
    console.log(data.data.map(m => m.id).filter(id => id.includes("vision")));
  } catch (err) {
    console.error(err);
  }
}
getModels();
