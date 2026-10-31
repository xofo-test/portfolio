# Portfolio — Senior Software Engineer

A static, zero-build portfolio for **MR Tony MR**, a Senior Software Engineer with
9+ years of experience in full-stack development, system design and AI-powered
products. Built with plain HTML, CSS and vanilla JavaScript — no framework, no
server, no build step.

## Quick start

Open `index.html` in a browser, or serve the folder for a closer-to-production
experience:

```bash
npx serve .
# or
python -m http.server 8000
```

The site works both over `file://` and any static host.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Hero, About, Selected Work, AI band, closing CTA |
| `experience.html` | Professional experience timeline, technical skills, achievements |
| `projects.html` | Five case studies (filter + dialog with problem/solution/architecture/outcomes) |
| `expertise.html` | AI & engineering expertise, reference architecture, decision log |
| `contact.html` | Contact form, contact cards, inline print-ready résumé |
| `resume.html` | Standalone one-page résumé (print / save as PDF) |

Shared assets: `styles.css` (design system), `app.js` (interactions + renderer),
`js/data.js` (customizable content), `assets/` (favicon + Open Graph image).

The pages at the repository root are the live site. The `prototype/` folder is the
earlier, superseded blueprint prototype (with its own stylesheet) kept for history —
it is not part of the published design.

## Customize the content (one file)

Everything a recruiter-visible edit needs — name, role, email, location, social
handles, hero strengths, daily-stack band and the technical-skills grid — lives in
**`js/data.js`**. Edit it and refresh; no build step is required.

```js
identity: {
  name: "MR Tony MR",        // change me
  email: "alex@alexmorgan.dev",
  ...
},
social: {
  github: { url: "https://github.com/alexmorgan-dev" },   // placeholder
  linkedin: { url: "https://www.linkedin.com/in/alexmorgan-dev" } // placeholder
}
```

Narrative content (About, experience timeline, project case studies, AI/architecture
expertise, achievements, education/certifications) is hardcoded in the HTML files,
matching the approved UI contract. To rebrand deeply, search-and-replace the name
"MR Tony MR" and update those sections in place.

### Before publishing

1. **Social handles** — replace the placeholder GitHub/LinkedIn URLs in `js/data.js`
   with real profiles.
2. **Domain** — update `site.url` in `js/data.js`, then update the canonical and
   Open Graph URLs (`https://alexmorgan.dev/…`) in each page's `<head>` and in
   `robots.txt` / `sitemap.xml`.
3. **Contact form** — set `contactForm.endpoint` in `js/data.js` to a form service
   URL (Formspree, Getform, Basin, etc.). Leave it empty to use the built-in
   `mailto:` fallback, which opens the visitor's email client pre-filled.
4. **Open Graph image** — `assets/og-image.png` is generated; replace it with a
   branded 1200×630 PNG if desired.

## Résumé download

`resume.html` (and the inline résumé on `contact.html#resume`) render a print-ready
one-page résumé. The **Print / Save as PDF** button opens the browser print dialog —
choose "Save as PDF" to download. No binary PDF ships with the repo.

## Design system — red editorial

`styles.css` is the single design system for every page. It carries the approved red
editorial language:

- **Colour** — near-black canvas (`#070707`), `#e10600` accents, red hairlines and
  soft red washes; a warm-paper light theme with a darker red (`#c40600`) so contrast
  holds in both.
- **Type** — heavy uppercase display headings with an outlined second line
  (`.display-solid` / `.display-outline`), mono uppercase micro-labels (`.um`), and a
  serif italic for emphasis. Outlined type falls back to solid red where
  `-webkit-text-stroke` is unsupported.
- **Layout language** — fixed vertical side rails (`.rail`), oversized circular
  decoratives bleeding off the edges (`.deco`), hairline dividers, red index numerals
  (`.page-index`, `.thumb-index`, `.project-index`), red arrow markers and
  date-stamp blocks (`.stamp`).
- **Components** — buttons, cards, badges, meters, filter bar, case-study dialog,
  tabs, forms, alerts, toast and the print-ready résumé all share those primitives.

All fonts, images and scripts are served locally; the site makes no runtime network
requests. Responsive breakpoints live at 1200/1000/900/720/520 px, followed by
`prefers-reduced-motion` and `@media print` blocks.

## Theme & accessibility

- Two themes, with red as the accent in both. Dark is the default on first visit,
  honouring OS preference; the header toggle persists the choice in `localStorage`
  (`am-theme`) and updates the browser `theme-color`.
- WCAG 2.1 AA-oriented: skip link, focus-visible rings, keyboard-navigable tabs and
  dialogs, `prefers-reduced-motion` support, labeled form fields, and both-theme
  contrast.
- SEO: per-page canonical URLs, Open Graph/Twitter cards, JSON-LD `Person` +
  `WebSite` structured data on the home page, `robots.txt` and `sitemap.xml`.

## Design decisions

- **Typography** — system-font stacks only (Inter/Segoe UI, a monospace stack and a
  serif stack), so the site renders identically offline and never blocks on a font
  request. The red editorial look comes from weight, scale, case and text-stroke,
  not from a download.
- **Animations** — hand-rolled CSS/JS (reveal, meter fill, dialog, pulse, scan)
  rather than a third-party animation library, to avoid conflicts with the approved
  interactions and keep the JavaScript payload minimal.

## Deployment

Any static host works (Netlify, Vercel, GitHub Pages, S3/CloudFront). No build
command, no environment variables, no server runtime.
