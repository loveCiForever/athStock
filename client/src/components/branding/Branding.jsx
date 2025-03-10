// ./client/src/components/branding/Branding.jsx

import BlackathStockLogo from "../../assets/logo/black-athStockLogo.png";
import WhiteathStockLogo from "../../assets/logo/white-athStockLogo.png";
import { useNavigate } from "react-router-dom";

const Branding = ({ theme }) => {
  const navigate = useNavigate();

  return (
    <button
      className="branding flex items-center justify-center active:scale-[.95] active:duration-75 transition-all"
      onClick={() => {
        navigate("/");
      }}
    >
      <img
        src={theme == "light" ? BlackathStockLogo : WhiteathStockLogo}
        alt="Logo"
        className="w-[70px] lg:w-[120px]"
      />
    </button>
  );
};

export default Branding;
