// ./application/client/src/pages/HomePage.jsx

import { useContext, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

const HomePage = () => {
  useEffect(() => {
    document.title =
      "athStock - Hỗ trợ đầu tư chứng khoán bằng trí tuệ nhân tạo";
  }, []);

  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`home-page w-full h-screen flex flex-col items-center justify-center `}
    >
      <h1 className={`text-3xl font-semibold`}>Toggle Theme Button</h1>
      <button
        className={`
            toggle-theme-button
            mt-5 py-4 px-8
            rounded-lg
            text-stock-up
            ${theme === "dark-theme" ? "bg-black/20" : "bg-gray-200"}

        `}
        onClick={toggleTheme}
      >
        Switch to {theme === "dark-theme" ? "light mode" : "dark mode"}
      </button>
    </div>
  );
};

export default HomePage;
