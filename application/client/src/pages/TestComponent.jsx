// ./application/client/src/pages/TestComponent.jsx

import { useEffect } from "react";
import { ColorPattern } from "../components/layout/test/ColorPattern";
import { ToggleThemeButton } from "../components/layout/test/ToggleThemeButton";
import { useTheme } from "../hooks/useTheme";
import Header from "../components/layout/header/Header";

const TestComponent = () => {
  useEffect(() => {
    document.title = "Test component page";
  }, []);

  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`test-component w-full min-h-screen flex flex-col items-center justify-start gap-10`}
    >
      <Header />
      <div className="flex flex-col w-full items-center gap-10 mt-[80px]">
        <h1 className="text-6xl font-bold mb-10">Test component page</h1>
        <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
        <ColorPattern />
      </div>
    </div>
  );
};

export default TestComponent;
