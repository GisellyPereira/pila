// Mirrored from src/shared/theme/tokens.ts — keep in sync when changing brand tokens.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        pila: "#CDB2ED",
        noite: "#2C1C3F",
        "noite-fundo": "#EDE7F6",
        "noite-elevado": "#D4C3E8",
        coral: "#A23F62",
        menta: "#6B39BD",
        laranja: "#D8D1EF",
        creme: "#E2D8F0",
        carrasco: "#9F2949",
      },
      fontFamily: {
        display: ["Inter_700Bold"],
        sans: ["Inter_400Regular"],
        "sans-bold": ["Inter_700Bold"],
        handwritten: ["Caveat_400Regular"],
        "handwritten-bold": ["Caveat_700Bold"],
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
