import { ArrowUp, ArrowDown, Minus } from "lucide-react";

const MarketCard = ({
  IndexName,
  Change,
  IndexValue,
  RatioChange,
  isExpanded,
  onClick,
}) => {
  const getBgColor = (Change) => {
    // if (checkData(Change)) {
    if (parseFloat(Change) > 0) {
      return "bg-green-200";
    } else if (Change < 0) {
      return "bg-red-200";
    }
    // }

    return "bg-gray-200";
  };

  const getStatusArrow = (Change) => {
    if (parseFloat(Change) > 0) {
      return <ArrowUp size={20} />;
    } else if (parseFloat(Change) < 0) {
      return <ArrowDown size={20} />;
    }

    return <Minus size={20} />;
  };

  const getTextColor = (Change) => {
    if (parseFloat(Change) > 0) {
      return "text-green-700";
    } else if (parseFloat(Change) < 0) {
      return "text-red-700";
    }
    return "text-gray-700";
  };

  const checkData = (data) => {
    return data ? true : false;
  };

  // console.log(onClick);

  return (
    <>
      {!isExpanded ? (
        <button
          onClick={onClick}
          className={`flex bg-white border border-gray-200 rounded-lg p-2 w-[23%] text-[14px] hover:bg-gray-100 ${
            onClick ? "" : ""
          }`}
        >
          <div
            className={`py-2 px-3 rounded-md flex justify-center items-center ${getBgColor(
              Change
            )} ${getTextColor(Change)}`}
          >
            {getStatusArrow(Change)}
          </div>

          <div className="flex flex-col w-[50%] ml-2 text-start">
            <div className="font-bold text-gray-700 tracking-widest">
              {IndexName}
            </div>
            <div>{IndexValue} pt</div>
          </div>

          <div
            className={`flex flex-col items-end w-[30%] ml-2 tracking-wide ${getTextColor(
              Change
            )}`}
          >
            <div className="font-semibold">
              {RatioChange > 0 ? "+" : ""}
              {RatioChange}
              {checkData(RatioChange) ? "%" : ""}
            </div>
            <div>{parseFloat(Change).toFixed(2)} pt</div>
          </div>
        </button>
      ) : (
        <div className="flex items-center justify-between w-full my-3 text-gray-600 rounded-md hover:bg-gray-100// text-[17px]">
          {IndexName === "VNINDEX" && (
            <div className="w-[8px] h-[20px] rounded-l-sm rounded-r-sm bg-green-500"></div>
          )}

          {IndexName === "HNXINDEX" && (
            <div className="w-[8px] h-[20px] rounded-l-sm rounded-r-sm bg-red-500"></div>
          )}

          {IndexName === "VN30" && (
            <div className="w-[8px] h-[20px] rounded-l-sm rounded-r-sm bg-blue-500"></div>
          )}

          {IndexName === "HNX30" && (
            <div className="w-[8px] h-[20px] rounded-l-sm rounded-r-sm bg-yellow-500"></div>
          )}

          <span className="flex ml-2 w-[25%] ">{IndexName}</span>
          <span className="flex items-center justify-end w-[25%]">
            {parseFloat(IndexValue).toFixed(2)}
          </span>
          <span
            className={`flex items-center justify-end w-[20%] mr-4 ${getTextColor(
              Change
            )}`}
          >
            {/* {parseFloat(Change) > 0 ? "+" : ""} */}
            {parseFloat(Change).toFixed(2)}
          </span>
          <div className="flex items-center justify-end w-[25%]">
            <div
              className={`flex w-full items-center justify-between py-[4px] rounded-md px-2 ${getBgColor(
                Change
              )} ${getTextColor(Change)}`}
            >
              {getStatusArrow(Change)}
              <span className={`${getTextColor(Change)}`}>
                {parseFloat(RatioChange).toFixed(2)}{" "}
                {checkData(Change) ? "%" : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketCard;
