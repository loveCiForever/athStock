// ./application/client/src/components/layout/test/ToggleThemeButton.jsx

export const ToggleThemeButton = ({ theme, toggleTheme }) => {
  return (
    <div className="w-full text-center">
      <h1 className={`text-3xl font-semibold mb-5`}>Toggle Theme Button</h1>
      <button
        className={`
            toggle-theme-button
            py-4 px-8
            border rounded-lg
        `}
        onClick={toggleTheme}
      >
        Switch to {theme === "dark-theme" ? "light mode" : "dark mode"}
      </button>
    </div>
  );
};
