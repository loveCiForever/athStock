// ./client/src/components/navbar/NavBar.jsx

import { useEffect, useState, useContext, use } from "react";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import LogoButton from "../../ui/buttons/LogoButton.jsx";
import LoggedUser from "../user-panel/UserImage.jsx";

import PageButton from "../../ui/buttons/NavButtonForHeader.jsx";
import { getBasePath } from "../../../utils/splitPath.jsx";
import HamburgerIcon from "../../../assets/icons/hamburger.svg";
import { UppercaseFirstLetterEachWord } from "../../../utils/formatText.jsx";
import { Link } from "react-router-dom";
import LogoutIcon from "../../../assets/icons/logOutIcon.png";
import DarkMode from "../../../assets/icons/darkmode.svg";
import LightMode from "../../../assets/icons/lightmode.svg";

const NavBar = ({ theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  let [currentBasePath, setCurrentBasePath] = useState(null);
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [toggleMenuDropdown, setToggleMenuDropdown] = useState(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  useEffect(() => {
    handleBasePathChange();
  }, [currentBasePath]);

  if (loading) {
    return <div className="w-full h-screen bg-red-500">LOADING ...</div>;
  }

  return (
    <nav
      className={`navbar flex fixed w-full items-center justify-between h-[80px] xl:h-[100px] border-b-[2px] px-6 sm:px-10 md:px-14 xl:px-40 ${
        theme == "light"
          ? "bg-white border-gray-100 text-black"
          : "bg-darkmodeNavbarColor border-black/30 text-white"
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
        {innerWidth > 1024 ? (
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
              <div className="absolute w-[220px] right-0 top-[38px] bg-white border-[1px] rounded-b-xl rounded-l-xl py-4 shadow-2xl z-0">
                <div className="user-panel px-6">
                  <Link
                    className="flex flex-col w-full text-left"
                    to={`/user/${user.userName}`}
                  >
                    <span className="text-md font-bold text-dark-grey">
                      {UppercaseFirstLetterEachWord(user.fullName)}
                    </span>
                    <span className="text-sm font-medium text-dark-grey">
                      @{user.userName}
                    </span>
                    <h2 className="mt-1 text-sm font-medium text-blue-500">
                      Edit your profile
                    </h2>
                  </Link>
                </div>

                <div className="w-full h-[1.3px] mt-3 mb-1 bg-gray-300"></div>

                <div className="flex flex-col w-full items-start justify-center gap-2 text-md xl:text-lg">
                  <button
                    className="hover:bg-gray-200 w-full h-full px-6 py-1 text-start "
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                  <button
                    className="hover:bg-gray-200 w-full h-full px-6 py-1 text-start "
                    onClick={() => navigate("/blog")}
                  >
                    Blog
                  </button>
                </div>

                <div className="w-full h-[1.2px] mt-1 mb-1 bg-gray-300"></div>

                <div className="flex flex-col w-full items-start justify-center gap-2 text-md xl:text-lg">
                  <button
                    className="hover:bg-gray-200 w-full h-full px-6 py-1 text-start "
                    onClick={null}
                  >
                    Switch to {theme == "light" ? "Dark Mode" : "Light Mode"}
                  </button>
                  <button
                    className="hover:bg-gray-200 w-full h-full px-6 py-1 text-start "
                    onClick={null}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
