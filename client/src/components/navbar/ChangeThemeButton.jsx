import DarkMode from "../../assets/icon/darkmode.svg";
import LightMode from "../../assets/icon/lightmode.svg";
import { setSession } from "../auth/session.jsx";
import { ThemeContext, UserContext } from "../../App.jsx";
import { useContext, useEffect } from "react";

const ChangeThemeButton = () => {
  let { theme, setTheme } = useContext(ThemeContext);

  const changeTheme = () => {
    let newTheme = theme == "light" ? "dark" : "light";

    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);

    setSession("theme", newTheme);
  };

  // useEffect(() => {
  //   console.log(theme);
  // });

  return (
    <button
      className={`flex items-center justify-center rounded-full bg-grey relative p-2 active:scale-[.90] active:duration-75 transition-all  ${
        theme == "light"
          ? "hover:bg-gray-200"
          : "hover:bg-black/40 bg-darkModeButtonColor"
      } `}
      onClick={changeTheme}
    >
      <img
        src={theme == "light" ? DarkMode : LightMode}
        alt="theme"
        className=" w-6 h-6"
      />
    </button>
  );
};

export default ChangeThemeButton;
// 1d85fc33
