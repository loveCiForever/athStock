// ./applications/client/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import FinancePage from "./pages/FinancePage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import TestComponent from "./pages/TestComponent.jsx";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/test" element={<TestComponent />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
