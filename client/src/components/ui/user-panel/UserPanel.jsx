// .client/src/components/navbar/UserNav.jsx

import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks-services/AuthContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import LogoutIcon from "../../../assets/icon/logOutIcon.png";
import DarkMode from "../../../assets/icon/darkmode.svg";
import LightMode from "../../../assets/icon/lightmode.svg";
import { useEffect, useContext } from "react";
import { ThemeContext, UserContext } from "../../../App.jsx";
import { UppercaseFirstLetterEachWord } from "../../utils/TextFormat.jsx";
import { setSession } from "../../hooks-services/session.jsx";
import { SignOutFunction } from "./SignOutFunction.jsx";
const UserNav = () => {
  const { user, signout } = useAuthContext();
  let { theme, setTheme } = useContext(ThemeContext);

  const changeTheme = () => {
    let newTheme = theme == "light" ? "dark" : "light";

    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);

    setSession("theme", newTheme);
    console.log(theme);
  };

  return (
    <div className="absolute right-0 z-50 mt-52">
      <div
        className={`flex flex-col items-start justify-center bg-white border-2 rounded-xl shadow-xl w-60 duration-200 ${
          theme == "light" ? "bg-white text-black" : "bg-black"
        }`}
      >
        <Link
          className="flex flex-col w-full text-left py-3 pl-8"
          to={`/user/${user.userName}`}
        >
          <span className="text-md font-bold text-dark-grey mb-[5px]">
            {UppercaseFirstLetterEachWord(user.fullName)}
          </span>
          <span className="text-md font-medium text-dark-grey">
            @{user.userName}
          </span>
        </Link>

        <div className="w-full border-t-[1px]">
          <button
            className="flex gap-2 link pl-8 py-2 w-full items-center hover:bg-gray-200"
            onClick={changeTheme}
          >
            <img
              src={theme == "light" ? DarkMode : LightMode}
              alt="logout"
              className="w-5 h-5 opacity-100"
            />
            {theme == "light" ? (
              <p>Switch to dark mode</p>
            ) : (
              <p>Switch to light mode</p>
            )}
          </button>
        </div>

        <div className="w-full">
          <button
            className="flex gap-2 link pl-8 py-2 w-full items-center hover:bg-gray-200"
            onClick={signOutFunc}
          >
            <img
              src={LogoutIcon}
              alt="logout"
              className="w-5 h-5 opacity-100"
            />
            <p>Sign out</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNav;
