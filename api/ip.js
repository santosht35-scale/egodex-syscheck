// api/ip.js
// Returns the caller's public IP + a free IP-geolocation lookup (ISP, city, country).
// Uses ipapi.co (1000 free req/day, no key). Falls back gracefully on lookup failure.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Prefer Vercel's resolved client IP, then standard forwarding headers.
  const fwd = req.headers['x-vercel-forwarded-for']
           || req.headers['x-forwarded-for']
           || req.headers['x-real-ip']
           || '';
  const ip = String(fwd).split(',')[0].trim() || (req.socket?.remoteAddress || '');

  let geo = null;
  try {
    const r = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: { 'User-Agent': 'egodex-syscheck/1.0' },
    });
    if (r.ok) {
      const j = await r.json();
      if (!j.error) {
        geo = {
          city: j.city || null,
          region: j.region || null,
          country: j.country_name || j.country || null,
          org: j.org || j.asn || null,
          asn: j.asn || null,
          timezone: j.timezone || null,
          postal: j.postal || null,
          latitude: j.latitude ?? null,
          longitude: j.longitude ?? null,
        };
      }
    }
  } catch (e) {
    // ignore — geo will stay null
  }

  res.status(200).json({ ip, geo, region: req.headers['x-vercel-ip-country-region'] || null });
}
