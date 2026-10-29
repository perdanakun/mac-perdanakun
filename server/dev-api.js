import { createEmailHandler } from './send-email.js';
import { createChatHandler } from './chat.js';

// Use the same handlers locally and on Vercel, without putting secrets in VITE_*.
export function portfolioApi(env) {
  const handlers = { '/api/send-email': createEmailHandler({ env }), '/api/chat': createChatHandler({ env }) };
  return {
    name: 'portfolio-local-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const handler = handlers[req.url?.split('?')[0]];
        if (!handler) return next();
        res.status = code => { res.statusCode = code; return res; };
        res.json = body => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); return res; };
        handler(req, res).catch(() => {
          if (!res.headersSent) res.status(500).json({ error: 'Something went wrong. Please try again.' });
        });
      });
    },
  };
}
