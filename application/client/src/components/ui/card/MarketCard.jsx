import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { formatNumber } from "../../../utils/formatNumber.jsx";
import { ThemeContext } from "../../../hooks/useTheme.jsx";
import { useContext } from "react";

const MarketCard = ({
  IndexName,
  Change,
  IndexValue,
  RatioChange,
  TotalVol,
  TotalVal,
  TradingSession,
  Advances,
  NoChanges,
  Declines,
  Ceilings,
  Floors,
  isExpanded,
  onClick,
}) => {
  const safeNumber = (value, fallback = 0) => {
    const num = parseFloat(value);
    return isNaN(num) ? fallback : num;
  };

  const { theme } = useContext(ThemeContext);
  // const { theme } = "dark-theme";
  const IndexValueFloat = safeNumber(IndexValue);
  const ChangeFloat = safeNumber(Change);
  const RatioChangeFloat = safeNumber(RatioChange);
  const TotalVolFloat = safeNumber(TotalVol);
  const TotalValFloat = safeNumber(TotalVal);
  const AdvancesFloat = safeNumber(Advances);
  const NoChangesFloat = safeNumber(NoChanges);
  const DeclinesFloat = safeNumber(Declines);
  const CeilingsFloat = safeNumber(Ceilings);
  const FloorsFloat = safeNumber(Floors);

  const getBgColor = (Change) => {
    if (Change > 0) {
      return "bg-green-200";
    } else if (Change < 0) {
      return "bg-red-200";
    }

    return "bg-gray-200";
  };

  const getStatusArrow = (Change, size = 20) => {
    if (Change > 0) {
      return <ArrowUp size={size} color="green" />;
    } else if (Change < 0) {
      return <ArrowDown size={size} color="red" />;
    } else if ((Change = 0)) {
      return <Minus size={size} color="yellow" />;
    }

    return <Minus size={size} color="gray" />;
  };

  const getTextColor = (Change) => {
    if (Change > 0) {
      return "text-green-700";
    } else if (parseFloat(Change) < 0) {
      return "text-red-700";
    }
    return "text-gray-700";
  };

  const checkData = (data) => {
    return data ? true : false;
  };

  const getTradingSession = (TradingSession) => {
    if (TradingSession == "C") return "Đóng cửa";
    if (TradingSession == "O") return "Mở cửa";
    if (TradingSession) return "Liên tục";
    if (TradingSession == "BREAK") return "Tạm nghỉ";
    if (TradingSession == "ATC") return "ATC";
    return TradingSession;
  };

  return (
    <>
      {!isExpanded ? (
        <button
          onClick={onClick}
          className={`
            flex flex-col border rounded-md p-2 w-[24%] text-[14px] font-mono
            ${
              theme === "dark-theme"
                ? "text-white border-gray-50 border-[1px] bg-black/30"
                : "border-gray-200 bg-gray-100"
            }
          `}
        >
          <div className="flex w-full">
            {/* <div
              className={`
              px-3 aspect-square rounded-md content-center justify-items-center
              ${getBgColor(Change)}
              ${getTextColor(ChangeFloat)}
            `}
            >
              {getStatusArrow(ChangeFloat)}
            </div> */}

            <div className="flex flex-col w-1/2 ml-2 text-start">
              <span className="font-bold text-gray-800/ tracking-widest">
                {IndexName}
              </span>
              <span>{IndexValue}pt</span>
              <span>{formatNumber(TotalVolFloat)} CP</span>
            </div>

            <div
              className={`flex flex-col items-end w-1/2 mr-1 tracking-wide `}
            >
              <span
                className={`
                font-bold ${getTextColor(ChangeFloat)}
                `}
              >
                {RatioChangeFloat > 0 ? "+" : ""}
                {RatioChangeFloat}
                {checkData(RatioChangeFloat) ? "%" : ""}
              </span>
              <span
                className={`
                font-semibold ${getTextColor(ChangeFloat)}
              `}
              >
                {ChangeFloat > 0 ? "+" : ""}
                {IndexName === "VNINDEX" || IndexName === "VN30"
                  ? (ChangeFloat * 100).toFixed(2)
                  : ChangeFloat.toFixed(2)}
                pt
              </span>
              <span className="">{formatNumber(TotalValFloat)}</span>
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="flex items-center">
              <ArrowUp size={15} color="var(--stock-up)" strokeWidth="3" />
              <span className="font-semibold text-[var(--stock-up)]">
                {AdvancesFloat + CeilingsFloat}
              </span>
              <span className="text-[var(--stock-ceiling)]">
                ({CeilingsFloat})
              </span>
            </div>
            <div className="flex items-center">
              <Minus size={15} color="var(--stock-no)" strokeWidth="3" />
              <span className="font-semibold text-[var(--stock-no)]">
                {NoChangesFloat}
              </span>
            </div>
            <div className="flex items-center">
              <ArrowDown size={15} color="var(--stock-down)" strokeWidth="3" />
              <span className="font-semibold text-[var(--stock-down)]">
                {DeclinesFloat + FloorsFloat}
              </span>
              <span className="text-[var(--stock-floor)]">({FloorsFloat})</span>
            </div>
            <span>{getTradingSession(TradingSession)}</span>
          </div>
        </button>
      ) : (
        <div className="flex items-center justify-between w-full my-3 text-gray-600// rounded-md hover:bg-gray-100// text-[17px]">
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
            {IndexValueFloat.toFixed(2)}
          </span>
          <span
            className={`flex items-center justify-end w-[20%] mr-4 
              ${getTextColor(ChangeFloat)}`}
          >
            {IndexName === "VNINDEX" || IndexName === "VN30"
              ? (ChangeFloat * 100).toFixed(2)
              : ChangeFloat.toFixed(2)}
          </span>
          <div className="flex items-center justify-end w-[25%]">
            <div
              className={`flex w-full items-center justify-between py-[4px] rounded-md px-2
                ${getBgColor(ChangeFloat)}
                ${getTextColor(ChangeFloat)}
              `}
            >
              {getStatusArrow(ChangeFloat)}
              <span
                className={`
                ${getTextColor(ChangeFloat)}`}
              >
                {RatioChangeFloat.toFixed(2)}{" "}
                {checkData(ChangeFloat) ? "%" : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketCard;
