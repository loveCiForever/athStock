import { useContext, useEffect, useState } from "react";

import { ThemeContext } from "../hooks/useTheme";
// import { Sun } from "lucide-react";

import Header from "../components/layout/header/Header";
import "../index.css";

const StockMarketPage = () => {
  useEffect(() => {
    document.title = "Stock Market in Real time";
  });

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`stocks-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary`}
    >
      <Header />
    </div>
  );
};

export default StockMarketPage;
