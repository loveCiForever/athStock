// app.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "./components/auth/session";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import EditorPage from "./pages/EditorPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./index.css";

export const ThemeContext = createContext({});
export const UserContext = createContext({});

const darkThemePreference = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const App = () => {
  const [theme, setTheme] = useState(() =>
    darkThemePreference() ? "dark" : "light"
  );

  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let themeInSession = getSession("theme");

    if (themeInSession) {
      setTheme(() => {
        document.body.setAttribute("data-theme", themeInSession);

        return themeInSession;
      });
    } else {
      document.body.setAttribute("data-theme", theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage theme={theme} />} />
            <Route path="/login" element={<SignInPage theme={theme} />} />
            <Route path="/register" element={<SignUpPage theme={theme} />} />

            <Route path="*" element={<NotFoundPage theme={theme} />} />

            <Route path="/editor" element={<EditorPage theme={theme} />} />
          </Routes>
        </Router>
      </UserContext.Provider>

      <ToastContainer />
    </ThemeContext.Provider>
  );
};

export default App;
