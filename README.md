# Portfolio

A scrollable portfolio built with Vite, React, TypeScript, Tailwind CSS, Framer Motion, and React Router. It keeps the original cut-paper artwork and bold motion while presenting work, skills, experience, and contact details in a familiar reading order. The artwork and interface use no game assets.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Validate with:

```bash
npm run typecheck
npm run lint
npm run build
```

## Make it yours

Edit **`src/content.ts`** for your name, role, bio, email, availability, social links, projects, skills, tools, experience, testimonials, resume details, and contact configuration. All editable portfolio copy and data live in that file. The supplied projects, metrics, dates, skill levels, and quotes are visibly marked examples; replace them with your real work and evidence before publishing.

The current portrait is an original placeholder at `public/portrait-placeholder.svg`. To use your own photo, place it in `public/`, then set `profile.portraitUrl` in `src/content.ts` to its public path, such as `/portrait.webp`. The home and About pages use that setting. Use a high contrast, transparent portrait for the intended cutout effect. Update `public/og-card.svg` and the page title and social metadata in `index.html` with your own identity.

The home page also uses an original paper-cut gesture at `public/hero-gesture.svg`. It is decorative and can be replaced with your own original SVG without changing portfolio content.

Set `profile.resumeUrl` to a public PDF path, such as `/resume.pdf`, to enable the resume button. If there is no PDF, the page offers an email request link. Set `profile.contactEndpoint` to a form service or server endpoint to submit contact cards; without one, the form opens a prefilled email draft. The visitor can also use the direct email link.

## Navigation

- Scroll the home page for project previews, an introduction, skills, experience, and contact. The top navigation jumps to each section, and the cards open detail pages with one click or tap.
- On a detail page, press Esc or use Home / Overview to return. The page navigation links to every section.
- Settings persist sound, motion intensity, and contrast in local storage. The site always respects the operating system's reduced motion preference. Sound starts off and uses synthesized WebAudio tones.

## Deploy

`npm run build` creates `dist/`. On Vercel or Netlify, import this folder as a Vite project (`npm run build`, output `dist`). `vercel.json` and `public/_redirects` keep direct section routes working. The build also copies `index.html` to `404.html` for GitHub Pages fallback routing.

For a GitHub Pages project site, build with `VITE_BASE_PATH=/YOUR-REPO/ npm run build` and publish `dist/`. The router uses the same base path. On a custom domain or user site, build without `VITE_BASE_PATH`. GitHub Pages serves deep links through the `404.html` fallback, which can return HTTP 404 even though the page renders; Vercel or Netlify provide normal 200 responses for those links.
