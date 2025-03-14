// ./client/src/components/navbar/HamburgerButton.jsx

import WhiteHamburger from "../../assets/icon/white/hamburger.svg";
import BlackHamburger from "../../assets/icon/black/hamburger.svg";

const HamburgerButton = ({ toggleSideBar, theme }) => {
  return (
    <button
      className={`notification p-2 rounded-full  active:scale-[.90] active:duration-75 transition-all bg-darkModeButtonColor ${
        theme == "light"
          ? " lg:hover:bg-gray-200 text-black"
          : "lg:hover:bg-black/40 text-white"
      }`}
      onClick={() => {
        toggleSideBar((prev) => !prev);
      }}
    >
      <img
        src={theme == "light" ? BlackHamburger : WhiteHamburger}
        alt="Hamburger"
        className="w-5 h-5 lg:w-6 lg:h-6"
      />
    </button>
  );
};

export default HamburgerButton;
