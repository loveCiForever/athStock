// NavBar.jsx

import { use, useEffect, useState } from "react";
import axios from "axios";

import Branding from "../branding/Branding";
import Hamburger from "./Hamburger.jsx";
import LoginButton from "./LoginButton.jsx";
import Notification from "./Notification.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import UserNav from "./UserNav.jsx";

const NavBar = ({ toggleSideBar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [toggleLinks, setToggleLinks] = useState(false);
  const { user } = useAuthContext();

  const handleBlur = () => {
    setTimeout(() => {
      setToggleLinks(false);
    }, 140);
  };

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
      className={`navbar sticky flex items-center justify-between h-[65px] w-full bg-white border-b border-gray-200 transition-shadow duration-300 ${
        isScrolled ? "shadow-sm shadow-gray-300" : "null"
      }`}
    >
      <div className="flex items-center justify-center">
        <div className={`ml-4 visible`}>
          <Hamburger toggleSideBar={toggleSideBar} />
        </div>
        <div className="ml-5">
          <Branding />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="mr-4">Market Status</div>
        <div className="mr-4">Current Datetime</div>

        {/* <p>{user ? "logged in" : "un logged in"}</p> */}

        <div className="mr-3">
          <Notification />
        </div>

        <div className="mr-7">
          {/* <LoginButton /> */}
          {!user ? (
            <LoginButton />
          ) : (
            <>
              <div
                className="flex items-center justify-center relative"
                onClick={() => setToggleLinks((prev) => !prev)}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 flex items-center justify-center">
                  <img
                    src={user.profile_img}
                    alt="profile image"
                    className="w-[70%] border border-grey/90 object-cover rounded-full"
                  />
                </button>
                {toggleLinks && <UserNav />}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
