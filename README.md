# Perdana — unified UI radius

Full project source, including the previous panel fix and linked Notes layout. All rounded HTML/CSS UI components now share one radius token.

## Change all radii

Edit one value in `src/design-tokens.css`:

```css
:root {
  --radius-ui: 8px;
}
```

Window, Dock, notifications, dropdowns, Appearance, Search, dialogs, buttons, search fields, sidebar selections, Finder entries, Gallery tiles, tooltips, note rows and mobile controls consume this token. Previous component-specific tokens are compatibility aliases pointing to it, not separate values. All 63 positive hardcoded CSS radius declarations have been replaced, including mobile overrides.

Set `--radius-ui: 4px` for squarer corners or `12px` for softer corners. No separate dark-theme edit is required.

Intentional structural corners stay flush: the sidebar/content seam, maximized windows, transparent resize handles and the bottom edge of mobile sheets. Pseudo-surfaces that use `inherit` follow their parent. The geometry of embedded icon artwork is part of its SVG/bitmap, rather than a CSS radius.

## Apply only the CSS update

If you already use the last panel-fix revision, replace these three files together:

- `src/design-tokens.css`
- `src/styles.css`
- `src/reference-ui.css`

No import change or new dependency is required. This keeps local edits in your other project files intact. The archive also includes the full project for a complete replacement.

The supplied light alpha values (`.10` for panel and Dock) are preserved; dark alpha stays at the values in your pasted file (`.72` panel, `.39` Dock). The explicitly requested glass surfaces no longer get forced opaque by the reduced-transparency override. The thin-rim treatment from the previous border guidance is included.

## Install

Use Node.js 22.12+ (22.x) or 24+.

```sh
npm ci
npm run dev
```

Build production with `npm run build`. The full `src` directory must be replaced together, since components, reference assets and styles share imports. Environment values stay in your local environment. Dependencies and `dist` are excluded from this archive.

## Window fix

The previous window-level blur, inset sidebar and decorative pseudo-frame were separate surfaces. They could create a doubled edge and let wallpaper/window compositing affect the sidebar seam.

The new composition is deliberately simple:

- One opaque window background.
- A full-height left sidebar, flush with the window edge.
- A right content pane directly beside it, separated by one thin divider.
- Only the outer window clips rounded corners. The sidebar has no inset margin, separate rounded frame, shadow or backdrop blur.

Finder, Notes and Gallery use the same two-column grid; their sidebar widths remain independently configurable. Existing window drag, resize, minimize, zoom and focus handling remain in place.

| Theme | Sidebar | Content |
|---|---|---|
| Light | `#ECECEC` | `#FFFFFF` |
| Dark | `#262626` | `#1A1A1A` |

Floating system surfaces (Dock, dropdowns, alerts and notifications) still use the original supplied SVG material references. The later screenshots override the inset window composition, not those separate controls.

## Simplified apps

Notes now shows Search, note titles and one-line previews on the left; one title and the note body on the right. Repeated document labels, role/location metadata, folder labels and note-count footers are removed. An optional Download CV action still appears when a CV URL is configured.

The starter biography is concise, placeholder instructions are removed, and an empty Clients note is replaced by Links. Existing known company names/dates are retained without inventing achievements or URLs.

Gallery has one compact title/count header followed directly by the image grid. The duplicate hero heading, subtitle, sidebar total and footer count are removed. Category filtering and project opening are preserved.

## Clickable note links

`RichText.jsx` renders real anchors without injecting HTML. Plain HTTP(S)/mailto URLs in text become links. Structured fragments let you choose a readable label:

```js
paragraphs: [
  ['Find me on ', { text: 'LinkedIn', href: 'https://www.linkedin.com/in/perdanakun/' }, '.'],
],
links: [
  { id: 'website', label: 'My website', href: 'https://perdanakun.com' },
],
```

Items may also have an optional `href`. External HTTP(S) links open in a new tab with `noopener noreferrer`. Unsupported URL protocols render as ordinary text. Search includes structured paragraph text and link labels.

## Files

- `src/design-tokens.css`: canonical theme/material aliases and the new pane colors.
- `src/styles.css`: base interaction layout.
- `src/reference-ui.css`: SVG-derived controls plus the revised flat two-pane window composition.
- `src/components/NotesApp.jsx`: lean note layout and linked content.
- `src/components/GalleryApp.jsx`: compact header and gallery grid.
- `src/components/RichText.jsx`: structured/plain-text links.
- `src/data/profile.js`: editable profile, notes, and links.
- `references/ui/`: the 13 original SVG sheets, preserved as reference resources and excluded from runtime downloads.

The prior SVG-derived traffic controls, icons, material densities, buttons, popups, alerts, notifications, Dock, mobile sheets and thumbnail viewport fix are included in this full source replacement. The personal wallpapers and existing project artwork remain in the project.

## Verification

`VALIDATION.json` records the current production builds at `/` and `/portfolio/`, 23 functional/browser checks and 80 radius/appearance assertions across light/dark and mobile. The checks include changing the shared token live from 8px to 4px and back, plus keeping the requested Dock transparency when the browser reports reduced transparency.

The remaining panel and link behavior is checked through window drag/resize, Spotlight, Notes links, Gallery filtering, virtual Trash and sheets at 360/390/768/820px widths. `SOURCE-MANIFEST.json` records the source hashes included in this archive.
