// ./application/client/src/hooks/useTheme.jsx

import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context; // { theme, toggleTheme, setTheme }
};
