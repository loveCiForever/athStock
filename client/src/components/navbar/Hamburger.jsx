// .client/src/components/navbar/Hamburger.jsx

import HamburgerIcon from "../../assets/icon/hamburgerIcon.svg";

const Hamburger = ({ toggleSideBar }) => {
  return (
    <button
      className="hamburger p-3 lg:hover:rounded-full lg:hover:bg-gray-200 active:scale-[.90] active:duration-75 transition-all"
      onClick={() => {
        toggleSideBar((prev) => !prev);
      }}
    >
      <img
        src={HamburgerIcon}
        alt="Hamburger"
        className="w-3 h-3 lg:w-4 lg:h-4"
      />
    </button>
  );
};

export default Hamburger;
