// api/qr.js
const QRCode = require('qrcode');

module.exports = async (req, res) => {
  try {
    const { data, size } = req.query;

    if (!data) {
      res.status(400).json({ error: "Missing 'data' query parameter" });
      return;
    }

    // Size defaults to 300; clamp between 128 and 1024
    const parsedSize = Math.min(Math.max(parseInt(size) || 300, 128), 1024);

    const buffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: parsedSize,
      margin: 1
    });

    res.setHeader('Content-Type', 'image/png');
    // Don’t cache dynamic results
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR' });
  }
};
