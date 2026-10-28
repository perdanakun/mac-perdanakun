# Perdana's portfolio

A macOS-inspired visual design portfolio built with React, Framer Motion, and Vite. Projects appear on the desktop and in Finder and Gallery; Notes contains profile information, and Mail contains contact links. The current interface uses the light theme.

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
