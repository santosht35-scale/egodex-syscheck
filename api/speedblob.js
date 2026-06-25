// api/speedblob.js
// Returns a fixed-size random buffer for the client to measure download speed against.
// Default = 2 MB. Capped at 10 MB to protect the Vercel egress budget.

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  let sz = parseInt(req.query?.sz, 10);
  if (!isFinite(sz) || sz <= 0) sz = 2 * 1024 * 1024;
  sz = Math.min(sz, 10 * 1024 * 1024);

  // Pseudo-random bytes — incompressible so transit time reflects real throughput.
  const buf = Buffer.allocUnsafe(sz);
  for (let i = 0; i < sz; i += 4) {
    buf.writeUInt32LE((Math.random() * 0xffffffff) >>> 0, i);
  }

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', String(sz));
  res.status(200).send(buf);
}
