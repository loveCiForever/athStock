import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import BlogsPage from "./pages/BlogsPage.jsx";
import StockMarketPage from "./pages/StockMarketPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/markets" element={<StockMarketPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
