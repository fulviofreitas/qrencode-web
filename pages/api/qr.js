import QRCode from 'qrcode';

export default async function handler(req, res) {
  const { text } = req.query;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }

  if (text.length > 2048) {
    return res.status(400).json({ error: 'Text must be 2048 characters or fewer' });
  }

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    res.status(200).json({ qrCode: dataUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
}
