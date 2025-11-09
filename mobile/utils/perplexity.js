// mobile/utils/perplexity.js
import axios from "axios";

// ⚠️ Use environment variable instead of hardcoding
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

export async function checkFakeNews(text, imageSummary = "") {
  const endpoint = "https://api.perplexity.ai/chat/completions";

  try {
    const response = await axios.post(
      endpoint,
      {
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a fact‑checker. Determine whether the news item is real or fake/official or unofficial, using any provided text or image/video context."
          },
          {
            role: "user",
            content: `News text: "${text}"\n${imageSummary ? "Image/Video context summary: " + imageSummary : ""}`
          }
        ],
        temperature: 0.0
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices?.[0]?.message?.content || "";
    return {
      verdict: content,
      details: JSON.stringify(response.data, null, 2)
    };
  } catch (err) {
    console.error("Perplexity API error:", err);
    return {
      verdict: "Error fetching verdict",
      details: err.message
    };
  }
}
