/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      "edu-sa": ["Edu SA Beginner", "cursive"],
      mono: ["Roboto Mono", "monospace"],
      comfortaa: ["Comfortaa", "sans-serif"],
    },
    extend: {
      maxWidth: {
        maxContent: "1260px",
        maxContentTab: "650px",
      },
      boxShadow: {
        "light-mode": "5px 5px 10px #a09f9f, -1px -1px 10px #ffffff",
        "dark-mode": "5px 5px 10px #111111, -1px -1px 10px #313131",
      },
      backgroundImage: {
        "light-gradient": "linear-gradient(145deg, #ffffff, #e6e6e6)",
        "dark-gradient": " linear-gradient(145deg, #232323, #1e1e1e)",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["dark"],
      backgroundImage: ["dark"],
    },
  },
  plugins: [],
};
