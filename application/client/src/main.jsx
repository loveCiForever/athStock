
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./hooks/useTheme.jsx";
import AuthContext from "./hooks/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContext>
    <ThemeProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeProvider>
  </AuthContext>
);
