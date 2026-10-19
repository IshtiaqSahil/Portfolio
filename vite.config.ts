import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base matches the GitHub Pages path: ishtiaqsahil.github.io/Portfolio/
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/',
});
