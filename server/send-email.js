import { createHash } from 'node:crypto';
import { createRateLimit, guardRequest, readJson, RequestError, respondToError } from './http.js';

const MAX_ATTACHMENT_BYTES = 1.5 * 1024 * 1024;
const emailPattern = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const defaultRecipient = 'perdanakurniawan25@gmail.com';

function attachmentsFor(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 1) throw new RequestError(400, 'Attach one file at a time.');
  return value.map(file => {
    if (!file || typeof file.filename !== 'string' || !file.filename.trim() || file.filename.length > 120 || /[\x00-\x1f/\\]/.test(file.filename)
      || typeof file.content !== 'string' || !file.content.length || file.content.length % 4 !== 0
      || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(file.content)) {
      throw new RequestError(400, 'The attachment is invalid. Please select it again.');
    }
    if (Buffer.from(file.content, 'base64').length > MAX_ATTACHMENT_BYTES) throw new RequestError(413, 'Choose an attachment smaller than 1.5 MB.');
    return { filename: file.filename.trim(), content: file.content };
  });
}

export function createEmailHandler({ env = process.env, fetchImpl = globalThis.fetch,
  rateLimit = createRateLimit(5, 10 * 60_000) } = {}) {
  return async (req, res) => {
    if (!guardRequest(req, res, rateLimit)) return;
    try {
      const body = await readJson(req, 2.2 * 1024 * 1024);
      const from = typeof body.from === 'string' ? body.from.trim() : '';
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
      const message = typeof body.message === 'string' ? body.message.trim() : '';
      if (body.website) throw new RequestError(400, 'Please try again.');
      if (!emailPattern.test(from) || from.length > 254 || /[\r\n]/.test(from)) throw new RequestError(400, 'Enter a valid reply email address.');
      if (name.length > 100 || /[\r\n]/.test(name)) throw new RequestError(400, 'Keep your name under 100 characters.');
      if (!subject || subject.length > 160 || /[\r\n]/.test(subject)) throw new RequestError(400, 'Enter a subject under 160 characters.');
      if (!message || message.length > 10_000) throw new RequestError(400, 'Enter a message under 10,000 characters.');
      if (typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,64}$/.test(body.requestId)) throw new RequestError(400, 'Please refresh the page and try again.');
      const attachments = attachmentsFor(body.attachments);
      if (!env.RESEND_API_KEY) throw new RequestError(503, 'Direct email is unavailable right now. Please use the email link below.');
      const payload = {
        from: env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
        to: [env.CONTACT_TO_EMAIL || defaultRecipient],
        reply_to: from,
        subject,
        text: `From: ${name || 'Portfolio visitor'} <${from}>\n\n${message}`,
        ...(attachments.length ? { attachments } : {}),
      };
      // Stable across retries of the same message, including a request whose response was lost.
      const digest = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(15_000),
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json',
          'Idempotency-Key': `portfolio-${body.requestId}-${digest}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.id) throw new Error('Email provider did not accept the request.');
      return res.status(200).json({ success: true, id: data.id });
    } catch (error) {
      return respondToError(res, error, 'We could not confirm sending. Try again, or use the email link below.');
    }
  };
}
