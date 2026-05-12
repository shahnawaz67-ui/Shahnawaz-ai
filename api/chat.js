  export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { messages } = body;

    if (!messages) return res.status(400).json({ error: 'No messages' });

    const groqMessages = [
      {
        role: 'system',
        content: 'You are Shahnawaz AI, a brilliant friendly assistant created by Shahnawaz. Be helpful, witty, and warm.'
      },
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: groqMessages,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'Sorry, I could not process that.';

    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  }
