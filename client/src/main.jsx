// ./server/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthContext from "./components/hooks-services/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContext>
    <App />
  </AuthContext>
);
