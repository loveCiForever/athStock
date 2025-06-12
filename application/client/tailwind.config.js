// ./applications/client/tailwind.config.js

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "text-primary": "var(--text-primary)",
      },
    },
  },
  plugins: [],
};
