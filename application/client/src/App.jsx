import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import FinancePage from "./pages/FinancePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SingleBlogPage from "./pages/SingleBlogPage.jsx";
import { ToastContainer } from "react-toastify";
import NewBlogPage from "./pages/NewBlogPage.jsx";
import TaggedBlogsPage from "./pages/TaggedBlogsPage.jsx";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/blog/new" element={<NewBlogPage />} />
        <Route path="/blog/:blog_id" element={<SingleBlogPage />} />
        <Route path="/blog/tag/:tag" element={<TaggedBlogsPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
