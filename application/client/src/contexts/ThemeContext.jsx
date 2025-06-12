// ./application/client/src/contexts/ThemeContext.jsx

import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const getInitialTheme = () => {
  return localStorage.getItem("theme") || "dark-theme";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark-theme" ? "light-theme" : "dark-theme"));

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark-theme") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
