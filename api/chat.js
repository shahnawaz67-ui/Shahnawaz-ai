export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'No messages' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are Shahnawaz AI, a brilliant friendly assistant created by Shahnawaz. Be helpful, witty, and warm. Use **bold** and *italics* when helpful.`,
      messages
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
