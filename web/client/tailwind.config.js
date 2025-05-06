/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkModeBackgroundColor: "#1c1c1d",
        darkmodeNavbarColor: "#252728",
        darkModeButtonColor: "#ffffff1a",

        lightModeBackgroundColor: "#f2f4f7",
        lightModeNavbarColor: "#ffffff",
        lightModeButtonColor: "#e2e5e9",

        lightModeBlogText: "#34425a",
      },
    },
  },
  plugins: [],
};
