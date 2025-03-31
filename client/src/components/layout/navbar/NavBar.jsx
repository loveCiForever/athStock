// ./client/src/components/navbar/NavBar.jsx

import { useEffect, useState, useContext } from "react";
import { useAuthContext } from "../../hooks-services/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import LogoButton from "../../ui/button/LogoButton.jsx";
import LoggedUser from "../../ui/user-panel/LoggedUser.jsx";
import PageButton from "../../ui/button/PageButton.jsx";
import { getBasePath } from "../../utils/PathSplitment.jsx";

const NavBar = ({ theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  let [currentBasePath, setCurrentBasePath] = useState(null);
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

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

  // useEffect(() => {
  //   console.log("USER:", user);
  //   console.log("loading: ", loading);
  // });

  if (loading) {
    return <div className="w-full h-screen bg-red-500">LOADING ...</div>;
  }

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
        {currentBasePath == "blog" || currentBasePath == "editor" ? (
          <PageButton
            currentBasePath={currentBasePath}
            navigateTo={"/editor"}
            name={"Write your own blog"}
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
