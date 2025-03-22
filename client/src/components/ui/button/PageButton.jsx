import { useNavigate } from "react-router-dom";

const PageButton = ({ currentLocationPath, navigateTo, name, solid }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        className={`page-button text-lg font-bold hover:text-orange-500 active:scale-[.90] active:duration-90 transition-all ${
          currentLocationPath == navigate ? "text-orange-500 " : ""
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
      {currentLocationPath == navigateTo && solid == false && (
        <hr className="absolute left-0 right-0 border-0 bottom-[-5px] h-[3px] bg-orange-400" />
      )}
    </div>
  );
};

export default PageButton;
