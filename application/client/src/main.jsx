import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import AuthContext from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContext>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthContext>
);
