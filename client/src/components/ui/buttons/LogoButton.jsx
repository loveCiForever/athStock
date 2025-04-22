// ./client/src/components/branding/Branding.jsx

import BlackAthStockLogo from "../../../assets/logos/black-athStockLogo.png";
import WhiteAthStockLogo from "../../../assets/logos/white-athStockLogo.png";
import { useNavigate } from "react-router-dom";

const LogoButton = ({ theme, navigateTo, forHeader }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`athstock-logo flex items-center justify-center active:scale-[.95] active:duration-75 transition-all`}
      onClick={() => {
        navigate(navigateTo);
      }}
    >
      {/* <img
          src={theme == "light" ? BlackAthStockLogo : WhiteAthStockLogo}
          alt="Logo"
          className={`w-[${size}]`}
        /> */}
      <div className="flex flex-col">
        <h1
          className={`flex ${
            forHeader ? "text-xl lg:text-3xl" : "text-3xl lg:text-5xl"
          }  font-extrabold`}
        >
          {/* ath <h1 className="text-orange-500">Stock</h1> */}
          athStock.
        </h1>
        {/* <h2>Trading with Ai</h2> */}
      </div>
    </button>
  );
};

export default LogoButton;
