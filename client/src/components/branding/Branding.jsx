import { useContext } from "react";
import BlackathStockLogo from "../../assets/logo/black-athStockLogo.png";
import WhiteathStockLogo from "../../assets/logo/white-athStockLogo.png";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../App";

const Branding = () => {
  const navigate = useNavigate();
  let { theme, setTheme } = useContext(ThemeContext);

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
        className="w-[70px] lg:w-[100px]"
      />
    </button>
  );
};

export default Branding;
