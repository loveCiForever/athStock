// NavBar.jsx

import { use, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import Branding from "../branding/Branding";
import Hamburger from "./Hamburger.jsx";
import LoginButton from "./LoginButton.jsx";
import Notification from "./Notification.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import UserNav from "./UserNav.jsx";
import useFetchCurrentDatetime from "./useFetchCurrentDatetime.jsx";
import CurrentDatetime from "./CurrentDatetime.jsx";
import MarketStatus from "./MarketStatus.jsx";
import { toast } from "react-toastify";

const NavBar = ({ toggleSideBar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [toggleLinks, setToggleLinks] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  // const { currentDatetime } = useFetchCurrentDatetime();

  // console.log(currentDatetime);
  // console.log(user);

  const handleUserBlur = () => {
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
      className={`navbar sticky flex items-center justify-between h-[65px] w-full bg-white border-b/ border-gray-200 transition-shadow duration-300 ${
        isScrolled ? "shadow-sm shadow-gray-300" : "null"
      }`}
    >
      <div className="flex items-center justify-center">
        <div className={`ml-2 lg:ml-4 visible`}>
          <Hamburger toggleSideBar={toggleSideBar} />
        </div>
        <div className="ml-2 lg:ml-5">
          <Branding />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center mr-5">
          {/* <MarketStatus data={currentDatetime} /> */}
          <div className="mr-2 lg:mr-4"></div>
          {/* <CurrentDatetime data={currentDatetime} /> */}
        </div>

        <div className="mr-2 lg:mr-4">
          <Notification />
        </div>

        <button
          className={`flex items-center justify-center mr-2 active:scale-[.90] active:duration-75 transition-all shadow-xs rounded-full px-2 lg:px-4 py-2 lg:hover:bg-gray-200 ${
            window.location.pathname === "/editor" ? "hidden" : ""
          }`}
          onClick={() => {
            if (!user) {
              toast.error("You need to login first");
              navigate("/login");
            } else {
              navigate("/editor");
            }
          }}
        >
          <p className="font-semibold text-sm lg:text-base tracking-wider">
            Write
          </p>
        </button>

        <div className="mr-4">
          {!user ? (
            <LoginButton />
          ) : (
            <>
              <div
                className="flex items-center justify-center relative"
                onClick={() => setToggleLinks((prev) => !prev)}
                // onBlur={handleUserBlur}
              >
                <button className="h-10 w-10 lg:w-12 lg:h-12 flex items-center justify-center">
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
