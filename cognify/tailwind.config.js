/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customOrange: 'rgba(253,246,238,255)'
      },
      fontFamily: {
        mono: ['to Mono', 'monospace'], // Add this line
      },
    },
  },  
  plugins: [],
}