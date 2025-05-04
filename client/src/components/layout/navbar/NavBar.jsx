// athStock/client/src/components/navbar/NavBar.jsx

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";

import LogoButton from "../../ui/buttons/LogoButton.jsx";
import PageButton from "../../ui/buttons/NavButtonForHeader.jsx";
import LoggedUser from "../user-panel/UserImage.jsx";

import HamburgerIcon from "../../../assets/icons/hamburger.svg";

import { UppercaseFirstLetterEachWord } from "../../../utils/formatText.jsx";
import { getBasePath } from "../../../utils/splitPath.jsx";
import { toast } from "react-toastify";
import axios from "axios";
function NavBar({ theme }) {
  const { user, loading, signout } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [toggleMenuDropdown, setToggleMenuDropdown] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  let [currentBasePath, setCurrentBasePath] = useState(null);
  const authHeaders = user
    ? { headers: { Authorization: `Bearer ${user.access_token}` } }
    : {};
  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };

    // console.log(innerWidth);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentBasePath, window.innerWidth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleBasePathChange = () => {
    setCurrentBasePath(getBasePath(window.location.pathname));
  };

  // const email = user.email;
  const signOut = async () => {
    // console.log("SIGN OUT");
    try {
      console.log(authHeaders);
      await axios.post(
        "http://localhost:8000/api/auth/signout",
        {},
        authHeaders
      );
      toast.success("Sign out successful");
      signout();
    } catch (error) {
      toast.error("Error signing out");
      console.log(error);
    }
  };

  useEffect(() => {
    handleBasePathChange();
  }, [currentBasePath]);

  if (loading) {
    return <div className="w-full h-screen bg-red-500">LOADING ...</div>;
  }

  return (
    <nav
      className={`navbar flex md:fixed w-full items-center justify-between h-[60px] md:h-[80px] xl:h-[100px] px-6 sm:px-10 md:px-14 xl:px-40 z-50 bg-gray-300 md:bg-white ${
        theme == "light"
          ? "bg-white text-black"
          : "bg-black/80 border-black/30 text-white"
      } transition-shadow duration-300 ${
        isScrolled ? "shadow-sm shadow-gray-300" : "null"
      }`}
    >
      <LogoButton
        theme={theme}
        navigateTo={"/"}
        forHeader={true}
        forFooter={false}
      />

      <div className="w-full ">
        {innerWidth > 1023 ? (
          <div className="flex items-center justify-end gap-4 sm:gap-10 xl:gap-16">
            {currentBasePath == "blog" || currentBasePath == "editor" ? (
              <PageButton
                currentBasePath={currentBasePath}
                navigateTo={"/editor"}
                name={"Publish Blog"}
                solid={true}
              />
            ) : (
              ""
            )}
            <PageButton
              currentBasePath={currentBasePath}
              navigateTo={"/"}
              name={"Home"}
              solid={false}
            />
            <PageButton
              currentBasePath={currentBasePath}
              navigateTo={"/blog"}
              name={"Blog"}
              solid={false}
            />
            <PageButton
              currentBasePath={currentBasePath}
              navigateTo={"/dashboard"}
              name={"Dashboard"}
              solid={false}
            />
            {!user ? (
              <div>
                <button
                  className={`home-btn text-md lg:text-lg font-bold hover:text-orange-500 active:scale-[.90] active:duration-90 transition-all`}
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
        ) : (
          <div className="relative flex items-center justify-end gap-4 xl:gap-16">
            {currentBasePath == "blog" || currentBasePath == "editor" ? (
              <PageButton
                currentBasePath={currentBasePath}
                navigateTo={"/editor"}
                name={"Publish Blog"}
                solid={true}
              />
            ) : (
              ""
            )}
            <img
              src={HamburgerIcon}
              alt="hamburger icon"
              className={`w-[40px] p-2 box-border z-20 bg-white ${
                !toggleMenuDropdown
                  ? "hover:bg-gray-200 rounded-xl"
                  : "rounded-t-full border-[1px] border-b-0"
              } `}
              onClick={() => {
                setToggleMenuDropdown((prev) => !prev);
              }}
            />
            {toggleMenuDropdown && (
              <div
                className="absolute w-[220px] right-00 top-[38px] bg-white border-[1px] rounded-b-xl rounded-l-xl py-4 shadow-2xl z-0 bg-red-100//"
                ref={contentRef}
              >
                {user && (
                  <div className="px-6 user-panel">
                    <Link
                      className="flex flex-col w-full text-left"
                      to={`/user/${user.user_name}`}
                    >
                      <span className="font-bold text-md text-dark-grey">
                        {UppercaseFirstLetterEachWord(user.full_name)}
                      </span>
                      <span className="text-sm font-medium text-dark-grey">
                        @{user.user_name}
                      </span>
                      <h2 className="mt-1 text-sm font-medium text-blue-500 hover:text-blue-700">
                        Edit your profile
                      </h2>
                    </Link>
                  </div>
                )}

                {user && (
                  <div className="w-full h-[1.3px] mt-3 mb-1 bg-gray-300"></div>
                )}

                <div className="flex flex-col items-start justify-center w-full gap-2 text-md xl:text-lg">
                  <button
                    className="w-full h-full px-6 py-1 hover:bg-gray-200 text-start "
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                  <button
                    className="w-full h-full px-6 py-1 hover:bg-gray-200 text-start "
                    onClick={() => navigate("/blog")}
                  >
                    Blog
                  </button>
                </div>

                <div
                  className={`w-full h-[1.2px] ${
                    user ? "my-1" : "my-4"
                  } bg-gray-300`}
                ></div>

                <div className="flex flex-col items-start justify-center w-full gap-2 text-md xl:text-lg">
                  <button
                    className="w-full h-full px-6 py-1 hover:bg-gray-200 text-start "
                    onClick={null}
                  >
                    Switch to {theme == "light" ? "Dark Mode" : "Light Mode"}
                  </button>
                  {user ? (
                    <button
                      className="w-full h-full px-6 py-1 hover:bg-gray-200 text-start "
                      onClick={signOut}
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      className="w-full h-full px-6 py-1 hover:bg-gray-200 text-start "
                      onClick={() => navigate("/login")}
                    >
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
