// ./application/client/src/contexts/ThemeContext.jsx

import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const getInitialTheme = () => {
  return localStorage.getItem("theme") || "dark-theme";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark-theme" ? "light-theme" : "dark-theme"));

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark-theme") {
      root.classList.remove("light-theme", "dark-theme");
      root.classList.add(theme);
    } else {
      root.classList.remove("dark-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
