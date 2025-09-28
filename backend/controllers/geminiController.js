import fetch from 'node-fetch';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';

dotenv.config();

// Helper: naive HTML -> text stripper
function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Controller: summarize a website using Gemini (Google) model
// POST /api/gemini/summarize
// body: { url: string }
const summarizeWebsite = asyncHandler(async (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ message: 'Missing url in request body' });

  // Fetch page content
  let pageText = '';
  try {
    const pageResp = await fetch(url, { timeout: 10000 });
    if (!pageResp.ok) throw new Error(`Failed to fetch url: ${pageResp.status}`);
    const html = await pageResp.text();
    pageText = stripHtml(html).slice(0, 100000); // cap to 100k chars
  } catch (err) {
    console.error('Error fetching page:', err);
    return res.status(502).json({ message: 'Failed to fetch provided URL' });
  }

  // Prepare prompt for Gemini: ask for <=500 character summary
  const prompt = `Summarize the following webpage content in 500 characters or less. Be concise and preserve meaning. Output only the summary (no extra commentary):\n\n${pageText}`;

  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ message: 'Server missing GEMINI_API_KEY env var' });

  try {
    // Example: call Google Gemini REST-compatible endpoint if available.
    // This is a best-effort example and may need to be adapted to your Gemini API endpoint.
    const endpoint = process.env.GEMINI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';

    const payload = {
      model: process.env.GEMINI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.2,
    };

    const apiResp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      timeout: 20000,
    });

    if (!apiResp.ok) {
      const text = await apiResp.text().catch(() => '');
      console.error('Gemini API error', apiResp.status, text);
      return res.status(502).json({ message: 'Gemini API error', detail: text });
    }

    const json = await apiResp.json();

    // Try to extract text from common response shapes
    let summary = '';
    if (json.choices && Array.isArray(json.choices) && json.choices[0]) {
      summary = json.choices[0].message?.content || json.choices[0].text || '';
    } else if (json.output) {
      // some Gemini outputs
      summary = typeof json.output === 'string' ? json.output : (json.output?.[0]?.content || '');
    } else if (json.result) {
      summary = json.result?.content?.[0]?.text || '';
    }

    summary = (summary || '').toString().trim();
    if (summary.length > 500) summary = summary.slice(0, 497) + '...';

    return res.status(200).json({ summary });
  } catch (err) {
    console.error('Error calling Gemini API:', err);
    return res.status(500).json({ message: 'Failed to generate summary' });
  }
});

export { summarizeWebsite };
