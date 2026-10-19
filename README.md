# Ishtiaq — portfolio

React + TypeScript + Tailwind CSS + Framer Motion, built with Vite. Deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml` on every push to `main`.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173/Portfolio/
npm run build    # production build into dist/
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
