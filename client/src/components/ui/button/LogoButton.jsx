// ./client/src/components/branding/Branding.jsx

import BlackAthStockLogo from "../../../assets/logo/black-athStockLogo.png";
import WhiteAthStockLogo from "../../../assets/logo/white-athStockLogo.png";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
const LogoButton = ({ theme, navigateTo }) => {
=======
const LogoButton = ({ theme, navigateTo, size }) => {
>>>>>>> web_dev
  const navigate = useNavigate();

  return (
    <button
      className="athstock-logo flex items-center justify-center active:scale-[.95] active:duration-75 transition-all"
      onClick={() => {
        navigate(navigateTo);
      }}
    >
      <img
        src={theme == "light" ? BlackAthStockLogo : WhiteAthStockLogo}
        alt="Logo"
<<<<<<< HEAD
        className="w-[70px] lg:w-[120px]"
=======
        className={`w-[160px] lg:w-[${size}] `}
>>>>>>> web_dev
      />
    </button>
  );
};

export default LogoButton;
