/** @type {import('tailwindcss').Config} */
export default {
  content: ['./web/index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { kanit: ['Kanit', 'sans-serif'] },
    },
  },
  plugins: [],
};
