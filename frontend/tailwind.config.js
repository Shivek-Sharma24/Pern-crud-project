import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui:{
    themes: [
      "pastel",
      "retro",
       "cyberpunk",
       "synthwave",
       "luxury",
       "autumn",
       "valentine",
       "aqua",
       "business",
       "coffee",
       "forest",
       "dracula",
       "night"
    ],
  }
}
