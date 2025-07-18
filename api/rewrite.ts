import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 添加 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, style } = req.body;

    if (!prompt || !style) {
      return res.status(400).json({ error: 'Missing prompt or style' });
    }

    const styleInstructions: Record<string, string> = {
      professional: 'Rewrite the following in a formal and professional tone.',
      casual: 'Rewrite the following in a casual, friendly tone.',
      humorous: 'Rewrite the following to be funny or witty, while keeping the meaning.',
    };

    const instruction = styleInstructions[style];
    if (!instruction) {
      return res.status(400).json({ error: 'Invalid style' });
    }

    if (!process.env['OPENAI_API_KEY']) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env['OPENAI_API_KEY']}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: instruction },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return res.status(500).json({ error: 'OpenAI API request failed' });
    }

    const data = await response.json();
    const rewritten = data?.choices?.[0]?.message?.content ?? 'No result from OpenAI';

    return res.status(200).json({ result: rewritten });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}