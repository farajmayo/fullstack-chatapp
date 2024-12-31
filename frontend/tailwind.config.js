import daisyui from "daisyui"

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
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "retro",
      "synthwave",
      "sunset",
      "nord",
      "dim",
      "winter",
      "coffee",
      "forest",
      "night",
      "acid",
      "lemonade",
      "business",
      "autumn",
      "cmyk",
      "dracula",
      "luxury",
      "black",
      "wireframe",
      "fantasy",
      "pastel",
      "lofi",
      "aqua",
      "garden",
      "halloween",
      "valentine",
      "cyberpunk",
      "corporate",
      "emerald",
      "bumblebee",

    ]
  }
}