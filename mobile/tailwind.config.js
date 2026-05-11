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
        pila: "#FFD93D",
        noite: "#1A1A2E",
        "noite-fundo": "#0F0F1E",
        "noite-elevado": "#252540",
        coral: "#FF6B6B",
        menta: "#06D6A0",
        laranja: "#FF9F1C",
        creme: "#F4F1DE",
        carrasco: "#E63946",
      },
      fontFamily: {
        display: ["ArchivoBlack_400Regular"],
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
