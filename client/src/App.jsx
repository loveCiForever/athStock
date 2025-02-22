// app.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import EditorPage from "./pages/EditorPage";
import NotFoundPage from "./pages/NotFoundPage";

export const UserContext = createContext({});

const App = () => {
  return (
    <UserContext.Provider value={{}}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<SignUpPage />} />

          <Route path="*" element={<NotFoundPage />} />

          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Router>

      <ToastContainer />
    </UserContext.Provider>
  );
};

export default App;
