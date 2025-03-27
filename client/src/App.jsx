// app.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "./components/hooks-services/session.jsx";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import EditorPage from "./pages/EditorPage";
import NotFoundPage from "./pages/NotFoundPage";
import BlogsPage from "./pages/BlogsPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";

import "./index.css";

export const ThemeContext = createContext({});
export const UserContext = createContext({});

export const darkThemePreference = () =>
  window.matchMedia("(prefers-color-scheme: light)").matches;

const App = () => {
  const [userAuth, setUserAuth] = useState({});
  const [theme, setTheme] = useState(() =>
    darkThemePreference() ? "dark" : "light"
  );

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
            <Route path="/blog" element={<BlogsPage theme={theme} />} />
            <Route path="/blog/:blog_id" element={<BlogPage theme={theme} />} />
          </Routes>
        </Router>
      </UserContext.Provider>

      <ToastContainer />
    </ThemeContext.Provider>
  );
};

export default App;
