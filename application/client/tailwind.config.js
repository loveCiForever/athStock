// ./applications/client/tailwind.config.js

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "stock-green": "var(--stock-green)",
        "stock-yellow": "var(--stock-yellow)",
        "stock-red": "var(--stock-red)",
        "stock-purple": "var(--stock-purple)",
        "stock-blue": "var(--stock-blue)",
      },
    },
  },
  plugins: [],
};
