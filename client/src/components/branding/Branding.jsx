import athStockLogo from "../../assets/logo/athStockLogo.png";
import { useNavigate } from "react-router-dom";

const Branding = () => {
  const navigate = useNavigate();

  return (
    <button
      className="branding flex items-center justify-center active:scale-[.95] active:duration-75 transition-all"
      onClick={() => {
        navigate("/");
      }}
    >
      <img src={athStockLogo} alt="Logo" className="w-[100px]" />
    </button>
  );
};

export default Branding;
