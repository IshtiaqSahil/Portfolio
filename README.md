# Portfolio site

Static site: `index.html`, `style.css`, `main.js`, plus GSAP, ScrollTrigger and Lenis in `vendor/` (bundled locally, so it works offline and needs no build step).

## Run locally
Double-click `index.html`, or serve the folder: `npx serve .`

## Editing
- **Text and projects:** all in `index.html`. Each project is a `<section class="chapter">`.
- **Links:** search for `href="#"` and the `TODO` comments to add your demo, repo, GitHub, LinkedIn, Discord and résumé URLs.
- **Project colours:** each section's `data-theme-bg` / `data-theme-accent` attributes. The page fades to these colours as you scroll.
- **Add a project:** copy a `chapter` section, give it a new `id`, and add a matching `<li>` to the `.rail` list near the top.
- **Real screenshots:** put an `<img>` inside a project's `.stage` div in place of the illustration.

## Deploy
- **GitHub Pages:** push this folder to a repo → Settings → Pages → deploy from branch.
- **Vercel / Netlify:** import the repo or drag the folder in. No build command needed.
