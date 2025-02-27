// .client/src/components/navbar/NavBar.jsx

import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";

import Branding from "../branding/Branding";
import Hamburger from "./Hamburger.jsx";
import LoginButton from "./LoginButton.jsx";
import Notification from "./Notification.jsx";
import LoggedUser from "./LoggedUser.jsx";
import WriteBlogButton from "./WriteBlogButton.jsx";

const NavBar = ({ toggleSideBar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuthContext();

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
      className={`navbar sticky flex items-center justify-between h-[65px] w-full bg-white border-b/ border-gray-200 transition-shadow duration-300 bg-red-200/ ${
        isScrolled ? "shadow-sm shadow-gray-300" : "null"
      }`}
    >
      <div className="flex items-center justify-center">
        <div className="ml-2 lg:ml-4 visible">
          <Hamburger toggleSideBar={toggleSideBar} />
        </div>
        <div className="ml-2 lg:ml-5">
          <Branding />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="mr-2 lg:mr-4">
          <Notification />
        </div>

        <div className="mr-2 lg:mr-4">
          <WriteBlogButton />
        </div>

        <div className="mr-2 lg:mr-6">
          {!user ? <LoginButton /> : <LoggedUser />}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
