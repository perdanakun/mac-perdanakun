# Perdana's portfolio

A macOS-inspired visual design portfolio built with React, Framer Motion, and Vite. Projects appear on the desktop and in Finder and Gallery; Notes contains profile information, and Mail sends contact messages directly. The current interface uses the light theme.

## Development

Use Node.js 22.12+ (22.x) or 24+.

```sh
npm ci
npm run dev
```

## Checks and production build

```sh
npm test
npm run build
npm run preview
```

The logic tests cover window resizing and focus, virtual Trash, portfolio search, and Dock geometry. The virtual Trash changes only the current tab's session state; it does not delete project source files.

Vite builds the site into `dist/`. The default base URL is `/`. To host under a subpath, set `VITE_BASE` in a local `.env` file using `.env.example`, or build with:

```sh
VITE_BASE=/portfolio/ npm run build
```

`vercel.json` contains the deployment cache headers. Keep environment values local; generated output and dependencies are excluded by `.gitignore`.

## Editing content and appearance

| File or directory | Purpose |
| --- | --- |
| `src/data/projects.js` | Project titles, categories, images, and desktop positions |
| `src/data/profile.js` | Profile, contact links, Dock apps, icons, and interface labels |
| `src/data/notes.js` | Notes content rendered by the Notes app |
| `src/assets/projects/` | Portfolio artwork and fallback project images |
| `src/assets/dock/`, `src/assets/reference/`, `src/assets/ui/` | Icons used by the interface |
| `src/assets/wallpapers/` | Active desktop and mobile wallpapers |
| `src/assets/cursors/` | Custom cursors used by the stylesheet |
| `src/design-tokens.css` | Shared colors, materials, spacing, and corner radius |
| `src/styles.css`, `src/reference-ui.css` | Layout, interaction, and visual styles |
| `src/components/` | Desktop, windows, apps, dialogs, and mobile sheets |
| `src/hooks/`, `src/utils/` | Interaction state and shared logic |
| `tests/` | Logic checks runnable with `npm test` |

Change `--radius-ui` in `src/design-tokens.css` to update the shared interface corner radius.

Project assets use Vite imports with `?no-inline` so they can be served as separate files. Mayora slides are discovered automatically from files named `mayora (0).webp`, `mayora (1).webp`, and so on anywhere under `src/assets/`, and sorted by number. The `everyday-icons` SVGs remain as the Mayora fallback when no matching slides exist.

Notes supports plain URLs and structured text/link fragments through `src/components/NotesRichText.jsx`. Empty CV and contact URLs remain hidden or disabled until configured.

## Attribution

Third-party attribution and the Apple Design Resources license are retained in `LICENSE-THIRD-PARTY` and `licenses/`. Original design reference sheets and earlier source archives, patches, and validation snapshots are available in Git history.

## Direct email and portfolio assistant

Mail sends to Perdana through Resend, with the visitor's address as `reply_to`. The sender and recipient are fixed on the server; visitors cannot redirect mail to arbitrary recipients. The compose form supports one attachment up to 1.5 MB, preserves the message after an error, and uses an idempotency key when retrying the same payload. A success message means Resend accepted the message, not that final inbox delivery has been verified.

The colorful orb in the menu bar opens a Siri-inspired **text chat** called `perdana.ai`. It answers questions about Perdana using Gemini and the public portfolio knowledge adapted from `perdanakun/win95-perdanakun` at revision `6e0a4a6045905de9ebc845f0aa4cf17ec48546f8`. Edit `server/portfolio-knowledge.js` to update that context. This is a separate copy, not an automatic sync. The assistant is not Apple's Siri and does not use the microphone or control the computer.

The chat supports follow-up questions, retry, stop, and a new conversation. History is kept in memory until the page is reloaded; only the latest 12 messages are sent as context. Messages are processed by Google Gemini. Email contents and attachments are processed by Resend. Neither handler logs message contents or API keys.

### Local setup

Copy `.env.example` to `.env.local`, then fill in your own server values:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Sender authorized by your Resend account |
| `CONTACT_TO_EMAIL` | Destination inbox; defaults to Perdana's public contact email |
| `GEMINI_API_KEY` | Google AI Studio / Gemini API key |
| `GEMINI_MODEL` | Optional model override; defaults to `gemini-3.5-flash-lite` |

Run `npm run dev`. A Vite development middleware runs the same handlers as the Vercel functions, so Mail and chat work locally without an additional backend command. Restart the dev server after changing environment values. Without keys, both interfaces show an unavailable message; no fake success or canned AI response is returned.

`npm run preview` serves the static production build only. Use `npm run dev` or a Vercel preview deployment when testing the API-backed features. The frontend calls `/api/send-email` and `/api/chat` at the origin root even when the site is built with a subpath.

### Vercel setup

Add the server variables above to **Project → Settings → Environment Variables** for the macOS project. Select the Preview and Production environments you intend to use, then redeploy. Environment variables in the Windows 95 project are not automatically shared with this project. Do not paste keys into source code or use `VITE_` prefixes for them.

Vercel discovers `api/send-email.js` and `api/chat.js` as Node functions; their time budget is 30 seconds. A verified Resend sender domain is recommended for production; `onboarding@resend.dev` is limited by Resend's testing rules. The functions reject cross-origin browser requests, validate body/attachment sizes, and have a per-instance request limit (5 emails per 10 minutes, 20 chat requests per minute per IP). These memory-based limits reset on cold starts and do not coordinate across instances. Configure Vercel Firewall rate limits on both API paths for deployment-wide abuse control.

`npm test` includes mocked provider success/failure, validation, rate limiting, bounded history, raw local request parsing, duplicate-send protection, and client timeout handling. It does not send real email or use a live Gemini key.
