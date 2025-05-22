import { useContext, useEffect, useState } from "react";

import { ThemeContext } from "../hooks/useTheme";
// import { Sun } from "lucide-react";

import Header from "../components/layout/header/Header";
import "../index.css";

const BlogsPage = () => {
  useEffect(() => {
    document.title = "Latest Blog";
  });

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`blogs-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary`}
    >
      <Header />
    </div>
  );
};

export default BlogsPage;
