// ./application/client/src/pages/HomePage.jsx

import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

import Header from "../components/layout/header/Header";

const BlogPage = () => {
  useEffect(() => {
    document.title = "athStock - Bài viết cộng đồng";
  }, []);

  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`blog-page w-full min-h-screen flex flex-col items-center justify-start gap-10`}
    >
      <Header />
      <div className="body flex flex-col w-full mt-[80px] px-6 sm:px-10 md:px-14 xl:px-40"></div>
    </div>
  );
};

export default BlogPage;
