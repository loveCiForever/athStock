import { getBasePath } from "../../../utils/splitPath";

import { useNavigate } from "react-router-dom";

const NavPageButton = ({ navigateTo, name, currentBasePath }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        className={`page-button text-lg font-bold hover:text-orange-500 active:scale-[.90] active:duration-90 transition-all `}
        onClick={() => navigate(navigateTo)}
      >
        {name}
      </button>
      {currentBasePath === getBasePath(navigateTo) && (
        <hr className="w-full absolute left-0 right-0 border-0 bottom-[-5px] h-[3px] bg-orange-400" />
      )}
    </div>
  );
};

export default NavPageButton;
