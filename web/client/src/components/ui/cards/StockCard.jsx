import UpArrow from "../../../assets/icons/upArrowIcon.png";
import DownArrow from "../../../assets/icons/downArrowIcon.png";

const StockCard = ({
  symbol,
  companyName,
  openPrice,
  currentPrice,
  changePercentage,
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
    <button className="flex items-center justify-between w-[800px] text-md h-6 py-6 hover:bg-gray-100 border-t border-gray-200">
      <span className="text-center w-[70px] py-1 text-sm font-semibold tracking-widest text-white bg-blue-400 rounded-md">
        {symbol}
      </span>
      <h1 className="flex items-center w-[350px] text-[15px] h-auto justify-start font-semibold tracking-wider text-gray-600 bg-red-200//">
        {companyName}
      </h1>
      <div className="flex items-center justify-end w-[90px] h-auto font-semibold bg-green-200// ">
        {openPrice} $
      </div>
      <div className="flex items-center justify-end w-[90px] h-auto font-semibold bg-red-200// ">
        {currentPrice} $
      </div>
      <div
        className={`flex w-[110px] h-6 px-2 py-1 rounded-md font-semibold tracking-wider items-center justify-between ${getBgColor(
          changePercentage
        )} ${getTextColor(changePercentage)}`}
      >
        <img
          src={changePercentage > 0 ? UpArrow : DownArrow}
          alt={"uparrow"}
          className="w-4 h-4 mr-1 opacity-100"
        />
        {changePercentage} %
      </div>
    </button>
  );
};

export default StockCard;
