import ArrowUp from "../../../assets/icon/upArrowIcon.png";
import ArrowDown from "../../../assets/icon/downArrowIcon.png";
import HorizontalIcon from "../../../assets/icon/horizontalIcon.png";

const MarketCard = ({
  IndexName,
  Change,
  IndexValue,
  RatioChange,
  isExpanded,
}) => {
  const getBgColor = (Change) => {
    // if (checkData(Change)) {
    if (Change > 0) {
      return "bg-green-200";
    } else if (Change < 0) {
      return "bg-red-200";
    }
    // }

    return "bg-gray-200";
  };

  const getStatusArrow = (Change) => {
    // if (checkData(data)) {
    if (Change > 0) {
      return ArrowUp;
    } else if (Change < 0) {
      return ArrowDown;
    }
    // }

    return HorizontalIcon;
  };

  const getTextColor = (Change) => {
    // if (checkData(data)) {
    if (Change > 0) {
      return "text-green-700";
    } else if (Change < 0) {
      return "text-red-700";
    }
    // }
    return "text-gray-700";
  };

  const checkData = (data) => {
    return data ? true : false;
  };

  return (
    <>
      {!isExpanded ? (
        <div className="flex bg-white border border-gray-200 rounded-lg p-2 w-[23%] ">
          <div
            className={`p-2 rounded-lg self-center flex justify-center items-center ${getBgColor(
              Change
            )} `}
          >
            <img
              src={getStatusArrow(Change)}
              alt={"Down Arrow"}
              className="w-5 h-5 opacity-100"
            />
          </div>

          <div className="flex flex-col w-[50%] ml-2 ">
            <div className="text-[14px] font-semibold text-gray-700 tracking-wide">
              {IndexName}
            </div>
            <div className="text-[14px] tracking-wider">{IndexValue}</div>
          </div>

          <div
            className={`flex flex-col items-end w-[30%] ml-2 text-[14px] tracking-wide ${getTextColor(
              Change
            )}`}
          >
            <div className="font-semibold text-[14px]">
              {RatioChange}
              {checkData(RatioChange) ? "%" : ""}
            </div>
            <div>{Change}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full my-3 text-gray-600 rounded-md hover:bg-gray-100">
          <div className="w-[6px] h-[20px] rounded-l-sm rounded-r-sm bg-red-500"></div>
          <span className="flex ml-2 w-[25%]">{IndexName}</span>
          <span className="flex items-center justify-end w-[25%]">
            {IndexValue}
          </span>
          <span
            className={`flex items-center justify-end w-[20%] mr-4 ${getTextColor(
              Change
            )}`}
          >
            {Change}
          </span>
          <div className="flex items-center justify-end w-[30%]">
            <div
              className={`flex w-full items-center justify-center py-[4px] rounded-md px-1 ${getBgColor(
                Change
              )}`}
            >
              <img
                src={getStatusArrow(Change)}
                alt={"Arrow Down"}
                className=" w-5 mr-[3px]"
              />
              <span className={`${getTextColor(Change)}`}>
                {RatioChange} {checkData(Change) ? "%" : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketCard;
