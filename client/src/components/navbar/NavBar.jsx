// .client/src/components/navbar/NavBar.jsx

import { useEffect, useState, useContext } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";

import Branding from "../branding/Branding";
import Hamburger from "./Hamburger.jsx";
import LoginButton from "./LoginButton.jsx";
import Notification from "./Notification.jsx";
import LoggedUser from "./LoggedUser.jsx";
import WriteBlogButton from "./WriteBlogButton.jsx";
import ChangeThemButton from "./ChangeThemeButton.jsx";
import { ThemeContext } from "../../App.jsx";

const NavBar = ({ toggleSideBar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuthContext();
  let { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`navbar sticky flex items-center justify-between h-[80px] w-full border-b-[0.5px] ${
        theme == "light"
          ? "bg-white border-gray-100"
          : "bg-darkmodeNavbarColor border-black/30"
      } transition-shadow duration-300 ${
        isScrolled ? "shadow-sm shadow-gray-300" : "null"
      }`}
    >
      <div className="flex items-center justify-center">
        <div className="ml-2 lg:ml-6 visible">
          <Hamburger toggleSideBar={toggleSideBar} />
        </div>
        <div className="ml-2 lg:ml-6">
          <Branding />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="mr-2 lg:mr-6">
          <WriteBlogButton />
        </div>

        <div className="mr-2 lg:mr-6">
          <Notification />
        </div>

        <div className={`mr-2 lg:mr-6`}>
          <ChangeThemButton />
        </div>

        <div className="mr-2 lg:mr-6">
          {!user ? <LoginButton /> : <LoggedUser />}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
