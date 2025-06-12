// application/client/src/components/layout/header/Header.jsx

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../contexts/AuthContext.jsx";

import { getBasePath } from "../../../utils/formatString.jsx";
import NavPageButton from "../../ui/button/NavPageButton.jsx";
import UserAvatar from "../user/UserAvatar.jsx";
import LoginButton from "../../ui/button/LoginButton.jsx";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentBasePath, setCurrentBasePath] = useState(
    getBasePath(window.location.pathname)
  );

  const handleBasePathChange = () => {
    setCurrentBasePath(getBasePath(window.location.pathname));
  };
  useEffect(() => {
    handleBasePathChange();
  }, [currentBasePath]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`header flex w-full items-center justify-between h-[80px] md:px-14 xl:px-40 fixed z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : ""
      }`}
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <button
        className={`left-section flex items-center justify-center active:scale-[.95] active:duration-90 transition-all`}
        onClick={() => {
          navigate("/");
        }}
      >
        <div className="logo flex flex-col">
          <div className={`flex text-3xl font-bold `}>
            <h1>ath</h1>
            <h1 className="text-orange-500">Stock.</h1>
          </div>
        </div>
      </button>

      <div className="right-section flex items-center justify-center gap-20">
        <NavPageButton
          navigateTo={"/"}
          name={"Home"}
          currentBasePath={currentBasePath}
        />
        <NavPageButton
          navigateTo={"/blog"}
          name={"Blog"}
          currentBasePath={currentBasePath}
        />
        <NavPageButton
          navigateTo={"/finance"}
          name={"Finance"}
          currentBasePath={currentBasePath}
        />

        {user ? <UserAvatar user={user} /> : <LoginButton />}
      </div>
    </div>
  );
};

export default Header;
