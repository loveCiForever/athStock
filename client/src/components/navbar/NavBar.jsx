// ./client/src/components/navbar/NavBar.jsx

import { useEffect, useState, useContext } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Branding from "../branding/Branding";
import HamburgerButton from "./HamburgerButton.jsx";
import Notification from "./Notification.jsx";
import LoggedUser from "./LoggedUser.jsx";
import WriteBlogButton from "./WriteBlogButton.jsx";

const NavBar = ({ theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLocationPath, setCurrentLocationPath] = useState(
    window.location.pathname
  );
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleLocationPathChange = () => {
      setCurrentLocationPath(window.location.pathname);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", handleLocationPathChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handleLocationPathChange);
    };
  }, []);

  return (
    <nav
      className={`navbar flex items-center justify-between h-[100px] w-full border-b-[2px] px-40 ${
        theme == "light"
          ? "bg-white border-gray-100"
          : "bg-darkmodeNavbarColor border-black/30"
      } transition-shadow duration-300 ${
        isScrolled ? "shadow-sm shadow-gray-300" : "null"
      }`}
    >
      <Branding theme={theme} />

      <div className="flex items-center justify-center gap-16">
        <div className="relative">
          <button
            className={`home-btn text-xl font-bold hover:text-orange-500 active:scale-[.90] active:duration-90 transition-all ${
              currentLocationPath == "/" ? "text-orange-500 " : ""
            }`}
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </button>
          {currentLocationPath == "/" && (
            <hr className="absolute left-0 right-0 bottom-[-5px] h-[4px] bg-orange-400" />
          )}
        </div>

        <div className="relative">
          <button
            className={`home-btn text-xl font-bold hover:text-orange-500 active:scale-[.90] active:duration-90 transition-all ${
              currentLocationPath == "/blog" ? "text-orange-500 " : ""
            }`}
            onClick={() => {
              navigate("/blog");
            }}
          >
            Blog
          </button>
          {currentLocationPath == "/blog" && (
            <hr className="absolute left-0 right-0 bottom-[-5px] h-[4px] bg-orange-400" />
          )}
        </div>

        <div className="relative">
          <button
            className={`home-btn text-xl font-bold hover:text-orange-500 active:scale-[.90] active:duration-90 transition-all ${
              currentLocationPath == "/dashboard" ? "text-orange-500 " : ""
            }`}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </button>
          {currentLocationPath == "/dashboard" && (
            <hr className="absolute left-0 right-0 bottom-[-5px] h-[4px] bg-orange-400" />
          )}
        </div>

        {!user ? (
          <div>
            <button
              className={`home-btn text-xl font-bold hover:text-orange-500 active:scale-[.90] active:duration-90 transition-all`}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        ) : (
          <LoggedUser theme={theme} />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
