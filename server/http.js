export class RequestError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// A small per-instance guard. Configure Vercel Firewall for a deployment-wide limit.
export function createRateLimit(max, windowMs) {
  const buckets = new Map();
  return (req, res) => {
    const now = Date.now();
    for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key);
    const key = String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'local').split(',')[0].trim();
    const bucket = buckets.get(key) || { count: 0, until: now + windowMs };
    // Bound memory even if many distinct clients visit one function instance.
    if (!buckets.has(key) && buckets.size >= 5000) {
      res.setHeader('Retry-After', '60');
      res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
      return false;
    }
    buckets.set(key, bucket);
    if (++bucket.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((bucket.until - now) / 1000)));
      res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
      return false;
    }
    return true;
  };
}

export function guardRequest(req, res, rateLimit) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.' });
    return false;
  }
  if (req.headers?.origin) {
    let matches = false;
    try { matches = new URL(req.headers.origin).host === req.headers.host; } catch { /* Invalid origin. */ }
    if (!matches) { res.status(403).json({ error: 'This request is not allowed.' }); return false; }
  }
  if (!String(req.headers?.['content-type'] || '').toLowerCase().startsWith('application/json')) {
    res.status(415).json({ error: 'Send a JSON request.' });
    return false;
  }
  return rateLimit(req, res);
}

export async function readJson(req, maxBytes) {
  if (Number(req.headers?.['content-length']) > maxBytes) throw new RequestError(413, 'This request is too large.');
  let body = req.body;
  if (body === undefined) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      const buffer = Buffer.from(chunk);
      size += buffer.length;
      if (size > maxBytes) throw new RequestError(413, 'This request is too large.');
      chunks.push(buffer);
    }
    body = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') {
    if (Buffer.byteLength(body) > maxBytes) throw new RequestError(413, 'This request is too large.');
    try { body = JSON.parse(body); } catch { throw new RequestError(400, 'Invalid JSON request.'); }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RequestError(400, 'Invalid request.');
  if (Buffer.byteLength(JSON.stringify(body)) > maxBytes) throw new RequestError(413, 'This request is too large.');
  return body;
}

export function respondToError(res, error, fallback) {
  return res.status(error instanceof RequestError ? error.status : 502)
    .json({ error: error instanceof RequestError ? error.message : fallback });
}
