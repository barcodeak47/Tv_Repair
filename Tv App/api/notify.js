export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // የደንበኛ ስም ወጥቶ አካባቢ (location) ተጨምሯል
  const { installerName, installerPhone, tvModel, issue, location } = req.body;

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  const ticketId = "TV-" + Math.floor(1000 + Math.random() * 9000);

  // በቴሌግራም የሚመጣው መልእክት ቅርጸት
  const message = `
📺 *አዲስ የተበላሸ ቲቪ ተመዝግቧል!*
━━━━━━━━━━━━━━━━━━
🆔 *መለያ ኮድ:* \`#${ticketId}\`
👷‍♂️ *ዲሽ ሰሪ:* ${installerName} (${installerPhone})
📍 *አካባቢ:* ${location}
🖥 *የቲቪ ዓይነት:* ${tvModel}
⚠️ *ብልሽት:* ${issue}
  `;

  try {
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    return res.status(200).json({ success: true, ticketId });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}