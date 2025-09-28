import 'dotenv/config'; // Make sure this is at the top to load environment variables
import { GoogleGenerativeAI } from '@google/generative-ai';
import { YoutubeTranscript } from 'youtube-transcript';


// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates hashtags from a video transcript.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const generateHashtags = async (req, res) => {
  const { videoUrl } = req.body;

  // 1. Input Validation
  if (!videoUrl) {
    return res.status(400).json({ error: 'videoUrl is required.' });
  }

  try {
    // 2. Fetch Video Transcript
    console.log('Fetching transcript...');

    // helper to extract video id from common youtube url formats
    const extractVideoId = (url) => {
      if (!url) return null;
      // match v=VIDEOID or youtu.be/VIDEOID
      const vMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
      if (vMatch && vMatch[1]) return vMatch[1];
      const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch && shortMatch[1]) return shortMatch[1];
      // also try to match embed urls
      const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch && embedMatch[1]) return embedMatch[1];
      return null;
    };

    const videoId = extractVideoId(videoUrl);
    let transcriptData = null;

    // Try fetching by videoId first (more reliable for some libraries)
    if (videoId) {
      console.log(`Attempting to fetch transcript for video id: ${videoId}`);
      try {
        transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      } catch (err) {
        console.warn('fetchTranscript by id failed, will try by URL. Error:', err?.message || err);
      }
    }

    // Fallback: try fetching using the original URL if id attempt failed
    if (!transcriptData || transcriptData.length === 0) {
      try {
        console.log('Attempting to fetch transcript by full URL as fallback...');
        transcriptData = await YoutubeTranscript.fetchTranscript(videoUrl);
      } catch (err) {
        console.warn('fetchTranscript by URL failed:', err?.message || err);
      }
    }

    if (!transcriptData || transcriptData.length === 0) {
      console.error('Transcript fetch returned empty. videoUrl:', videoUrl, 'videoId:', videoId);
      return res.status(404).json({ error: 'Could not fetch transcript for this video.' });
    }
    const fullTranscript = transcriptData.map(item => item.text).join(' ');

    // 3. Call Gemini API
    console.log('Generating hashtags with Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following video transcript and generate exactly 3-5 relevant, concise, and popular hashtags.
      Format the output as a single string of hashtags separated by spaces, like this: #ExampleOne #ExampleTwo #ExampleThree
      
      Transcript: "${fullTranscript.substring(0, 3000)}" 
    `; // Using a substring to avoid overly long transcripts

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 4. Format and Send Response
    // Clean up the text and split into an array
    const hashtags = responseText.trim().split(/\s+/);
    
    console.log('Successfully generated hashtags:', hashtags);
    res.status(200).json({ hashtags });

  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Failed to generate hashtags.' });
  }
};