const fetch = require("node-fetch");
const fs = require("fs");

async function testOCR() {
  try {
    const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const res = await fetch("http://localhost:3000/api/ocr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64Data }),
    });
    const text = await res.text();
    console.log("OCR Result:", text);
  } catch (err) {
    console.error(err);
  }
}
testOCR();
