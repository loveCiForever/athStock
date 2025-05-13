import UpArrow from "../../../assets/icons/upArrowIcon.png";
import DownArrow from "../../../assets/icons/downArrowIcon.png";
import { TruncateText, UppercaseFullString } from "../../../utils/formatText";
const StockCard = ({
  symbol,
  companyName,
  change,
  currentPrice,
  ratioChange,
  onClick,
}) => {
  const getBgColor = (data) => {
    if (data) {
      if (data > 0) {
        return "bg-green-200";
      } else {
        return "bg-red-200";
      }
    }

    return "bg-gray-200";
  };

  const getTextColor = (data) => {
    if (data) {
      if (data > 0) {
        return "text-green-700";
      } else {
        return "text-red-700";
      }
    }

    return "text-gray-700";
  };
  return (
    <button
      className="flex items-center justify-between w-[800px] text-md py-2 hover:bg-gray-100 border-t border-gray-200"
      onClick={onClick}
    >
      <span className="text-center w-[70px] py-1 text-sm font-semibold tracking-widest text-white bg-blue-500 rounded-md">
        {UppercaseFullString(symbol)}
      </span>
      <h1 className="flex items-center w-[350px] text-[15px] h-auto justify-start font-semibold tracking-wider text-gray-600 bg-red-200//">
        {TruncateText(companyName, 35)}
      </h1>
      <div className="flex items-center justify-end w-[90px] h-auto font-semibold bg-red-200// ">
        {currentPrice}
      </div>
      <div
        className={`flex items-center justify-end w-[90px] h-auto font-semibold bg-green-200// ${getTextColor(
          change
        )} `}
      >
        {change}
      </div>
      <div
        className={`flex w-[110px] px-2 py-1 rounded-md font-semibold tracking-wider items-center justify-between ${getBgColor(
          ratioChange
        )} ${getTextColor(ratioChange)}`}
      >
        <img
          src={ratioChange > 0 ? UpArrow : DownArrow}
          alt={"uparrow"}
          className="w-4 h-4 mr-1 opacity-100"
        />
        {ratioChange} %
      </div>
    </button>
  );
};

export default StockCard;
