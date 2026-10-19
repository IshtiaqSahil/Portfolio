import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The page source lives in web/. `npm run build` writes the finished site to the
// repo root (index.html + assets/), so GitHub Pages works whether it is set to
// "Deploy from a branch" or "GitHub Actions". CI sets PAGES_OUT to build into dist/.
export default defineConfig({
  root: 'web',
  publicDir: '../public',
  base: '/Portfolio/',
  plugins: [react()],
  build: {
    outDir: process.env.PAGES_OUT ?? '..',
    emptyOutDir: false,
  },
});
