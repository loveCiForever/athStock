// application/client/src/components/layout/header/Header.jsx

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../contexts/AuthContext.jsx";

import { getBasePath } from "../../../utils/formatString.jsx";
import NavPageButton from "../../ui/button/NavPageButton.jsx";
import UserAvatar from "../user/UserAvatar.jsx";
import LoginButton from "../../ui/button/LoginButton.jsx";

import { Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      className={`header flex w-full items-center justify-between h-[80px] px-5 md:px-14 xl:px-40 fixed z-50 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <button
        className={`left-section flex items-center justify-center active:scale-[.95] active:duration-90 transition-all`}
        onClick={() => {
          navigate("/");
          setIsMenuOpen(false);
        }}
      >
        <div className="logo flex flex-col">
          <div className={`flex text-2xl md:text-3xl font-bold`}>
            <h1>ath</h1>
            <h1 className="text-orange-500">Stock.</h1>
          </div>
        </div>
      </button>

      <button
        className="md:hidden z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`
        fixed top-0 right-0 h-full w-[250px] bg-inherit md:relative md:w-auto md:h-auto
        flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-20
        p-8 md:p-0 pt-24 md:pt-0
        transition-transform duration-300 md:translate-x-0
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        md:flex
      `}
      >
        <NavPageButton
          navigateTo={"/"}
          name={"Home"}
          currentBasePath={currentBasePath}
          onClick={() => setIsMenuOpen(false)}
        />
        <NavPageButton
          navigateTo={"/blog"}
          name={"Blog"}
          currentBasePath={currentBasePath}
          onClick={() => setIsMenuOpen(false)}
        />
        <NavPageButton
          navigateTo={"/finance"}
          name={"Finance"}
          currentBasePath={currentBasePath}
          onClick={() => setIsMenuOpen(false)}
        />

        {user ? <UserAvatar user={user} /> : <LoginButton />}
      </div>
    </div>
  );
};

export default Header;
