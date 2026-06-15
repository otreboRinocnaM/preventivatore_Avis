/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'avis-dark': '#1e3a5f',
        'avis-medium': '#2d5f9e',
        'avis-light-bg': '#f0f4f8',
      },
    },
  },
  plugins: [],
};
