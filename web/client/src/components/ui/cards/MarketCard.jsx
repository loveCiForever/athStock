import ArrowUp from "../../../assets/icons/upArrowIcon.png";
import ArrowDown from "../../../assets/icons/downArrowIcon.png";
import HorizontalIcon from "../../../assets/icons/horizontalIcon.png";

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
        <div className="flex bg-white border border-gray-200 rounded-lg p-2 w-[23%] text-[14px] ">
          <div
            className={`p-2 rounded-md flex justify-center items-center ${getBgColor(
              Change
            )} `}
          >
            <img
              src={getStatusArrow(Change)}
              alt={"Down Arrow"}
              className="w-6 h-6 opacity-100"
            />
          </div>

          <div className="flex flex-col w-[50%] ml-2 ">
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
              {RatioChange}
              {checkData(RatioChange) ? "" : ""}
            </div>
            <div>{Change} pt</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full my-3 text-gray-600 rounded-md hover:bg-gray-100 text-[17px]">
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
            {IndexValue}
          </span>
          <span
            className={`flex items-center justify-end w-[20%] mr-4 ${getTextColor(
              Change
            )}`}
          >
            {Change}
          </span>
          <div className="flex items-center justify-end w-[25%]">
            <div
              className={`flex w-full items-center justify-between py-[4px] rounded-md px-2 ${getBgColor(
                Change
              )}`}
            >
              <img
                src={getStatusArrow(Change)}
                alt={"Arrow Down"}
                className=" w-5 mr-[3px]"
              />
              <span className={`${getTextColor(Change)}`}>
                {RatioChange} {checkData(Change) ? "" : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketCard;
