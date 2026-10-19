# Ishtiaq — portfolio

React + TypeScript + Tailwind CSS + Framer Motion, built with Vite.

**Important:** the page source is `web/index.html` + `src/`. The `index.html` and `assets/` at the repo root are the *built* site. Run `npm run build` and commit them after every change, so GitHub Pages serves the latest version. (If Pages is set to "GitHub Actions", the workflow in `.github/workflows/deploy.yml` also builds and deploys automatically.)

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173/Portfolio/
npm run build    # builds the site into index.html + assets/ at the repo root
```

## Editing content
Almost everything you'd want to change is in **`src/content.ts`**:
- name, email, hero tagline, about paragraph
- the five skills
- the projects: name, category, accent colour, headline stat, summary, tags, and `link` (set a URL to enable the button)
- `PORTRAIT_URL`: drop a photo in `public/portrait.png` and point this at it to replace the hero orb

Other places:
- **Marquee tiles:** `ROW_ONE` / `ROW_TWO` in `src/sections/MarqueeSection.tsx`
- **Project illustrations:** `src/visuals/ProjectVisuals.tsx`, one component per project. Swap any for a real screenshot.

## Structure
```
src/
  components/  FadeIn, Magnet, AnimatedText, ContactButton, LiveProjectButton
  sections/    Hero, Marquee, About, Services (Skills), Projects
  visuals/     code-drawn project illustrations
  content.ts   all site text
```
