import HamburgerIcon from "../../assets/icon/hamburgerIcon.svg";

const Hamburger = ({ toggleSideBar }) => {
  return (
    <button
      className="hamburger p-3 hover:rounded-full hover:bg-gray-200 active:scale-[.90] active:duration-75 transition-all"
      onClick={() => {
        // console.log("Hamburger button clicked");
        toggleSideBar((prev) => !prev);
      }}
    >
      <img src={HamburgerIcon} alt="Hamburger" className="w-4 h-4" />
    </button>
  );
};

export default Hamburger;
