# Portfolio site

Static site: `index.html`, `style.css`, `main.js`, plus GSAP, ScrollTrigger and Lenis in `vendor/` (bundled locally, so it works offline and needs no build step).

## Run locally
Double-click `index.html`, or serve the folder: `npx serve .`

## Editing
- **Globe (opening screen):** the projects on the globe — name, one-liner, badge, colours and position on the sphere — are in the `PROJECTS` list at the top of `main.js`. It auto-advances every 6.5 s (`DUR` in `initGlobe`).
- **Case studies:** the in-depth pages are the `<article class="case">` blocks near the bottom of `index.html`. They open from "Explore project" on the globe or "Deep dive" on each section, and can be linked directly as `#case-argus`, `#case-verity`, etc.
- **Text and projects:** all in `index.html`. Each project section is a `<section class="chapter">`.
- **Links:** search for `href="#"` and the `TODO` comments to add your demo, repo, GitHub, LinkedIn, Discord and résumé URLs.
- **Project colours:** each section's `data-theme-bg` / `data-theme-accent` attributes. The page fades to these colours as you scroll.
- **Add a project:** copy a `chapter` section and a `case` article with a new id, add a matching `<li>` to the `.rail` list, and add an entry to `PROJECTS` in `main.js`.
- **Real screenshots:** put an `<img>` inside a project's `.stage` div in place of the illustration.

## Deploy
- **GitHub Pages:** push this folder to a repo → Settings → Pages → deploy from branch.
- **Vercel / Netlify:** import the repo or drag the folder in. No build command needed.
