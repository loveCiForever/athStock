// athStock/client/src/components/branding/Branding.jsx

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
      <div className="flex flex-col">
        <h1
          className={`flex ${
            forHeader ? "text-xl lg:text-3xl" : "text-3xl lg:text-5xl"
          }  font-extrabold`}
        >
          athStock.
        </h1>
      </div>
    </button>
  );
};

export default LogoButton;
