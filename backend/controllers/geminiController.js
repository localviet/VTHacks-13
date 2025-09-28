import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config'; // To load environment variables from .env file

// Initialize the Google Generative AI client
// It's good practice to initialize this once and reuse it.
const genAI = new GoogleGenerativeAI("AIzaSyAvNc4_CwbjDYq3FCxf9KYr7kcE6E6N3HY");

//CREATE TAGS
export const tagWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    // 1. Input Validation
    if (!url) {
      return res.status(400).json({ error: 'URL is required in the request body.' });
    }

    console.log(`Summarizing URL: ${url}`);

    // 2. Prepare the prompt for the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Please provide a concise, 3-5 words as tags in a list of the website's niche features found at this URL: ${url}. Strictly 3-5 words seperated by spaces only.`;

    // 3. Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    // 4. Send the summary back to the client
    res.status(200).json({ summary });

  } catch (error) {
    console.error("Error during summarization:", error);
    res.status(500).json({ error: "Failed to generate summary from Gemini API." });
  }
};
/**
 * Accepts a URL in the request body and uses the Gemini API to generate a summary.
 * Note: Gemini cannot directly access website content. It relies on its existing knowledge.
 * For live website scraping, you would need another tool like Puppeteer or Cheerio.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const summarizeWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    // 1. Input Validation
    if (!url) {
      return res.status(400).json({ error: 'URL is required in the request body.' });
    }

    console.log(`Summarizing URL: ${url}`);

    // 2. Prepare the prompt for the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Please provide a concise, one-paragraph summary of the website found at this URL: ${url}. Based on your knowledge, what is its primary purpose?`;

    // 3. Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    // 4. Send the summary back to the client
    res.status(200).json({ summary });

  } catch (error) {
    console.error("Error during summarization:", error);
    res.status(500).json({ error: "Failed to generate summary from Gemini API." });
  }
};