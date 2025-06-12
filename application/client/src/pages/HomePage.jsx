// ./application/client/src/pages/HomePage.jsx

import { useEffect } from "react";
import { ColorPattern } from "../components/layout/test/ColorPattern";
import { ToggleThemeButton } from "../components/layout/test/ToggleThemeButton";
import { useTheme } from "../hooks/useTheme";

const HomePage = () => {
  useEffect(() => {
    document.title =
      "athStock - Hỗ trợ đầu tư chứng khoán bằng trí tuệ nhân tạo";
  }, []);

  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`home-page w-full h-screen flex flex-col items-center justify-center gap-10`}
    >
      <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
      <ColorPattern theme={theme} />
    </div>
  );
};

export default HomePage;
