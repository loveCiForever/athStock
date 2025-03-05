// .client/src/components/navbar/LoginButton.jsx

import { useNavigate } from "react-router-dom";
import LoginIcon from "../../assets/icon/login.svg";
import { useContext } from "react";
import { ThemeContext } from "../../App";

const LoginButton = () => {
  const navigate = useNavigate();
  let { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      className={`flex items-center justify-center active:scale-[.90] active:duration-75 transition-all shadow-xs rounded-full px-2 lg:px-5 py-[8px] ${
        theme == "light"
          ? " lg:hover:bg-gray-200 text-black"
          : "lg:hover:bg-black/40 text-white bg-darkModeButtonColor"
      }`}
      onClick={() => {
        navigate("/login");
      }}
    >
      <p className="font-semibold text-sm lg:text-base tracking-wider hidden lg:inline-block">
        Login
      </p>
      <img src={LoginIcon} alt="login-button" className="lg:hidden w-5" />
    </button>
  );
};

export default LoginButton;
