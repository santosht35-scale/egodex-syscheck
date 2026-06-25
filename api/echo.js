// api/echo.js
// Accepts an arbitrary binary POST body, returns the byte count received.
// Used by the client to time an upload for upload-speed measurement.

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  let bytes = 0;
  try {
    for await (const chunk of req) bytes += chunk.length;
  } catch (e) {
    return res.status(500).json({ error: e.message, bytes });
  }
  res.status(200).json({ bytes });
}
