module.exports = async function handler(req: any, res: any) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, style }: { prompt: string; style: string } = req.body;

    // 验证输入参数
    if (!prompt || !style) {
      return res.status(400).json({ error: 'Missing prompt or style' });
    }

    // 定义风格指令
    const styleInstructions: Record<string, string> = {
      professional: 'Rewrite the following in a formal and professional tone.',
      casual: 'Rewrite the following in a casual, friendly tone.',
      humorous: 'Rewrite the following to be funny or witty, while keeping the meaning.',
    };

    const instruction = styleInstructions[style];
    if (!instruction) {
      return res.status(400).json({ error: 'Invalid style' });
    }

    // 检查是否有 OpenAI API 密钥
    if (!process.env['OPENAI_API_KEY']) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // 调用 OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env['OPENAI_API_KEY']}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `${instruction}\n\n${prompt}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(500).json({ error: 'Failed to generate rewrite' });
    }

    const data = await response.json();
    const rewrittenText = data.choices[0]?.message?.content;
    
    if (!rewrittenText) {
            return res.status(500).json({ error: 'No rewritten text received' });
    }

    return res.status(200).json({ rewrittenText });  
  } catch (error: unknown) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};