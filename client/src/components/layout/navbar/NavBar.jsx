// ./client/src/components/navbar/NavBar.jsx

import { useEffect, useState, useContext } from "react";
import { useAuthContext } from "../../hooks-services/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import LogoButton from "../../ui/button/LogoButton.jsx";
import LoggedUser from "../../ui/user-panel/LoggedUser.jsx";
import PageButton from "../../ui/button/PageButton.jsx";

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
          ? "bg-white border-gray-100 text-black"
          : "bg-darkmodeNavbarColor border-black/30 text-white"
      } transition-shadow duration-300 ${
        isScrolled ? "shadow-sm shadow-gray-300" : "null"
      }`}
    >
      <LogoButton theme={theme} navigateTo={"/"} />

      <div className="flex items-center justify-center gap-16">
        {currentLocationPath == "/blog" || currentLocationPath == "/editor" ? (
          <PageButton
            currentLocationPath={currentLocationPath}
            navigateTo={"/blog"}
            name={"Write your own blog"}
            solid={true}
          />
        ) : (
          ""
        )}

        <PageButton
          currentLocationPath={currentLocationPath}
          navigateTo={"/"}
          name={"Home"}
          solid={false}
        />

        <PageButton
          currentLocationPath={currentLocationPath}
          navigateTo={"/blog"}
          name={"Blog"}
          solid={false}
        />

        <PageButton
          currentLocationPath={currentLocationPath}
          navigateTo={"/dashboard"}
          name={"Dashboard"}
          solid={false}
        />

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
