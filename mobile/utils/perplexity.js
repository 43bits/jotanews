import axios from "axios";

const PERPLEXITY_API_KEY = "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";

if (!PERPLEXITY_API_KEY) {
  console.warn("⚠️ Perplexity API key is not set. Please set process.env.PERPLEXITY_API_KEY");
}

/**
 * Check whether a news item (text, image URL, or video URL) is real or fake / official or unofficial.
 *
 * @param {string} content - News text or media URL
 * @param {string} [context=""] - 
 * @returns {Promise<{ verdict: string, details: string }>}
 */
export async function checkFakeNews(content, context = "") {
  const endpoint = "https://api.perplexity.ai/chat/completions";

  const isVideo = /youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com/.test(content);

  const systemPrompt = isVideo
    ? `
You are a fact-checking assistant.
You will receive a video URL. You cannot watch the video.
- Determine if the video is from an official news channel or an unofficial/random uploader.
- If possible, analyze the video title or description via public sources.
- Provide a short verdict: "Official", "Unofficial", or "Unknown".
- Give a concise reasoning based on URL, channel, or public info.
`
    : `
You are a fact-checking assistant.
You will receive a text snippet, image URL, or news content.
- If text, determine if the news is REAL or FAKE.
- If image or video URL, explain based on context or public info.
- Always provide a verdict: "REAL", "FAKE", or "UNKNOWN".
- Give a concise reasoning.
`;

  try {
    const response = await axios.post(
      endpoint,
      {
        model: "sonar-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Content: "${content}"${context ? "\nContext: " + context : ""}` }
        ],
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "";

    const verdictLine = reply.split("\n")[0].trim();
    const verdict = verdictLine.match(/REAL|FAKE|UNKNOWN|Official|Unofficial/i)
      ? verdictLine
      : isVideo
      ? "Unknown"
      : "UNKNOWN";

    return {
      verdict,
      details: reply
    };

  } catch (err) {
    console.error("Perplexity API error:", err);
    return {
      verdict: "Error fetching verdict",
      details: err.message
    };
  }
}
