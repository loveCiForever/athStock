import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../hooks/useTheme";
import Header from "../components/layout/header/Header";
import BlogCard from "../components/ui/card/BlogCard";
import axios from "axios";
import { DEVELOPMENT_BLOG_SERVER_BASE_URL } from "../utils/config";

const HomePage = () => {
  useEffect(() => {
    document.title =
      "athStock - Hỗ trợ đầu tư chứng khoán bằng trí tuệ nhân tạo";
  }, []);
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`home-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary`}
    >
      <Header />

      {/* <div className="body flex flex-col flex-1 w-full mt-20 px-6 sm:px-10 md:px-14 xl:px-40"></div> */}
    </div>
  );
};

export default HomePage;
