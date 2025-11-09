import fetch from "node-fetch";
import * as cheerio from "cheerio";

export const fetchPreview = async (url) => {
  try {
    
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const getMeta = (name) =>
      $(`meta[property='${name}']`).attr("content") ||
      $(`meta[name='${name}']`).attr("content") ||
      "";

    const preview = {
      title: getMeta("og:title") || $("title").text() || "",
      description: getMeta("og:description") || "",
      image: getMeta("og:image") || null,
      video: getMeta("og:video") || null,
      siteName: getMeta("og:site_name") || null,
    };

    return preview;
  } catch (err) {
    console.error("Preview fetch failed:", err.message);
    return null;
  }
};
