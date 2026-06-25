// api/ping.js
// Minimal endpoint for round-trip latency measurement. Returns a tiny JSON payload
// with the server-side timestamp. Client measures wall time per fetch and aggregates.

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.status(200).json({ t: Date.now() });
}
