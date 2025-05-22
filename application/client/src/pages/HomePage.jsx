import { useContext, useEffect, useState } from "react";

import { ThemeContext } from "../hooks/useTheme";

import Header from "../components/layout/header/Header";
import "../index.css";

const HomePage = () => {
  useEffect(() => {
    document.title = "Home";
  });

  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`home-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary`}
    >
      <Header />
    </div>
  );
};

export default HomePage;
