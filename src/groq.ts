import type { RepurposedContent } from './types';

function parseGroqResponse(rawText: string): RepurposedContent | null {
  try {
    // Remove markdown code blocks if present
    let cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Find JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      twitter: parsed.twitter || '',
      instagram: parsed.instagram || '',
      linkedin: parsed.linkedin || '',
      reels: parsed.reels || '',
      telegram: parsed.telegram || '',
    };
  } catch (e) {
    console.error('Parse error:', e);
    return null;
  }
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are a social media content expert. Repurpose the given content into 5 formats. Return ONLY a valid JSON object with NO markdown, NO backticks, NO extra text. Use this exact structure:
{
  "twitter": "string (thread format, max 5 tweets separated by \\n\\n---\\n\\n, each under 280 chars)",
  "instagram": "string (caption with emojis and hashtags, max 2200 chars)",
  "linkedin": "string (professional tone, storytelling format, max 3000 chars)",
  "reels": "string (hook + script with [VISUAL] and [TEXT] cues, max 60 seconds)",
  "telegram": "string (conversational, can use markdown bold and bullets)"
}`;

export async function repurposeContent(input: string): Promise<RepurposedContent> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is not set');

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Repurpose this content: ${input}` },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const rawText: string = data.choices?.[0]?.message?.content ?? '';

  const parsed = parseGroqResponse(rawText);
  if (!parsed) {
    throw new Error('Failed to parse Groq response as JSON');
  }
  return parsed;
}
