import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../utils/PathSplitment";
const PageButton = ({ currentBasePath, navigateTo, name, solid }) => {
  const navigate = useNavigate();

  // console.log(currentLocationPath);
  // console.log(navigateTo);

  return (
    <div className="relative">
      <button
        className={`page-button text-lg font-bold hover:text-orange-500 active:scale-[.90] active:duration-90 transition-all ${
          currentBasePath == getBasePath(navigateTo) ? "text-orange-500 " : ""
        } ${
          solid == true
            ? "py-2 px-6 bg-black/80 rounded-xl  text-white font-medium text-sm tracking-wider hover:text-white hover:bg-black/50"
            : ""
        }`}
        onClick={() => {
          navigate(navigateTo);
        }}
      >
        {name}
      </button>
      {currentBasePath == getBasePath(navigateTo) && solid == false && (
        <hr className="absolute left-0 right-0 border-0 bottom-[-5px] h-[3px] bg-orange-400" />
      )}
    </div>
  );
};

export default PageButton;
