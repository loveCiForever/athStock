import { useEffect, useState } from "react";
import axios from "axios";

import CollapseAllIcon from "../../../assets/icon/collapseAllIcon.png";
import ExpandAllIcon from "../../../assets/icon/expandAllIcon.png";
<<<<<<< HEAD
import ArrowUp from "../../../assets/icon/upArrowIcon.png";
import ArrowDown from "../../../assets/icon/downArrowIcon.png";
import HorizontalIcon from "../../../assets/icon/horizontalIcon.png";
=======
import MarketCard from "../../ui/card/MarketCard";
>>>>>>> web_dev

// import MarketsGraph from "./MarketsGraph";

const Market = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [marketData, setMarketData] = useState({
    vnindex: {
      data: [
        {
          IndexValue: 1200.5,
<<<<<<< HEAD
          Change: 15.25,
          RatioChange: 1.28,
=======
          Change: +15.25,
          RatioChange: +1.28,
>>>>>>> web_dev
        },
      ],
    },
    vn30: {
      data: [
        {
          IndexValue: 1100.75,
          Change: -5.5,
          RatioChange: -0.5,
        },
      ],
    },
    hnxindex: {
      data: [
        {
          IndexValue: 250.3,
<<<<<<< HEAD
          Change: 2.1,
          RatioChange: 0.84,
=======
          Change: +2.1,
          RatioChange: +0.84,
>>>>>>> web_dev
        },
      ],
    },
    hnx30: {
      data: [
        {
          IndexValue: 220.0,
          Change: -1.0,
          RatioChange: -0.45,
        },
      ],
    },
  });

  // const fetchDailyMarketIndices = async () => {
  //   try {
  //     const response = await axios
  //       .get
  //       // "http://127.0.0.1:5000/api/market_daily_index"
  //       ();
  //     setMarketData(response.data);
  //     // console.log("Market Data:", response.data);
  //   } catch (error) {
  //     console.error("Error fetching market data:", error);
  //   }
  // };?

<<<<<<< HEAD
  useEffect(() => {
    console.log(marketData);
  });
=======
  // useEffect(() => {
  //   console.log(marketData.vnindex.data[0].Change);
  // });
>>>>>>> web_dev

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

<<<<<<< HEAD
  const checkData = (data) => {
    return data && data.length > 0 ? true : false;
  };

  const getMarketInfo = (data) => {
    if (checkData(data)) {
      return {
        indexValue: data[0].IndexValue,
        change: data[0].Change,
        ratioChange: parseFloat(data[0].RatioChange).toFixed(2),
      };
    }
    return {
      indexValue: "N/A",
      change: "N/A",
      ratioChange: "N/A",
    };
  };

  const getStatusArrow = (data) => {
    if (checkData(data)) {
      if (data[0].Change > 0) {
        return ArrowUp;
      } else if (data[0].Change < 0) {
        return ArrowDown;
      }
    }

    return HorizontalIcon;
  };

  const getBgColor = (data) => {
    if (checkData(data)) {
      if (data[0].Change > 0) {
        return "bg-green-200";
      } else if (data[0].Change < 0) {
        return "bg-red-200";
      }
    }

    return "bg-gray-200";
  };

  const getTextColor = (data) => {
    if (checkData(data)) {
      if (data[0].Change > 0) {
        return "text-green-700";
      } else if (data[0].Change < 0) {
        return "text-red-700";
      }
    }

    return "text-gray-700";
  };

  // const vnindex = getMarketInfo(marketData.vnindex.data);
  // const vn30 = getMarketInfo(marketData.vn30.data);
  // const hnxindex = getMarketInfo(marketData.hnxindex.data);
  // const hnx30 = getMarketInfo(marketData.hnx30.data);

  // useEffect(() => {
  //   fetchDailyMarketIndices();
  //   const interval = setInterval(() => {
  //     fetchDailyMarketIndices();
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  // ['VNINDEX', 'HNXINDEX', 'UPCOMINDEX', 'VN30', 'VN100', 'HNX30']

  return (
    <div className="flex flex-col w-[1000px] h-auto mt-[0px] bg-white">
      <div className="flex flex-col items-start">
        <button
          className={`flex items-center justify-center uppercase text-gray-700 tracking-widest font-bold text-[12px] ${
            isExpanded ? "px-0" : "px-10"
          } `}
          onClick={handleExpandClick}
        >
          <img
            className="h-4 w-4 mr-[4px] mb-[2px]"
=======
  return (
    <div className="flex flex-col w-[1200px] bg-red-200//">
      <div className="flex flex-col items-start">
        <button
          className={`flex items-center justify-center uppercase text-gray-800 tracking-widest font-bold text-[14px] `}
          onClick={handleExpandClick}
        >
          <img
            className="h-5 w-5 mr-[6px]"
>>>>>>> web_dev
            src={isExpanded ? CollapseAllIcon : ExpandAllIcon}
            alt={isExpanded ? "Collapse All Icon" : "Expand All Icon"}
          />
          Visualize
        </button>

        {!isExpanded && (
<<<<<<< HEAD
          <div className="flex flex-row items-center justify-between w-full px-10 mt-2">
            <div className="flex bg-white border border-gray-200 rounded-lg p-2 w-[23%] ">
              <div
                className={`p-2 rounded-lg self-center flex justify-center items-center ${getBgColor(
                  marketData.vnindex.data
                )} `}
              >
                <img
                  src={getStatusArrow(marketData.vnindex.data)}
                  alt={"Down Arrow"}
                  className="w-4 h-4 opacity-100"
                />
              </div>

              <div className="flex flex-col w-[50%] ml-2 ">
                <div className="text-[12px] font-semibold text-gray-700">
                  VN-INDEX
                </div>
                <div className="text-[12px] tracking-wider">
                  {marketData.vnindex.indexValue}
                </div>
              </div>

              <div
                className={`flex flex-col items-end w-[30%] ml-2 text-[12px] tracking-wide ${getTextColor(
                  marketData.vnindex.data
                )}`}
              >
                <div className="font-semibold">
                  {marketData.vnindex.ratioChange}
                  {checkData(marketData.vnindex.data) ? "%" : ""}
                </div>
                <div>{marketData.vnindex.change}</div>
              </div>
            </div>

            <div className="flex bg-white border border-gray-200 rounded-lg p-2 w-[23%] ">
              <div
                className={`p-2 rounded-lg self-center flex justify-center items-center ${getBgColor(
                  marketData.hnxindex.data
                )} `}
              >
                <img
                  src={getStatusArrow(marketData.hnxindex.data)}
                  alt={"Down Arrow"}
                  className="w-4 h-4 opacity-100"
                />
              </div>

              <div className="flex flex-col w-[50%] ml-2 ">
                <div className="text-[12px] font-semibold text-gray-700">
                  HNX-INDEX
                </div>
                <div className="text-[12px] tracking-wider">
                  {marketData.hnxindex.indexValue}
                </div>
              </div>

              <div
                className={`flex flex-col items-end w-[30%] ml-2 text-[12px] tracking-wide ${getTextColor(
                  marketData.vnindex.data
                )}`}
              >
                <div className="font-semibold">
                  {marketData.hnxindex.ratioChange}
                  {checkData(marketData.hnxindex.data) ? "%" : ""}
                </div>
                <div>{marketData.hnxindex.change}</div>
              </div>
            </div>

            <div className="flex bg-white border border-gray-200 rounded-lg p-2 w-[23%] ">
              <div
                className={`p-2 rounded-lg self-center flex justify-center items-center ${getBgColor(
                  marketData.vn30.data
                )} `}
              >
                <img
                  src={getStatusArrow(marketData.vn30.data)}
                  alt={"Down Arrow"}
                  className="w-4 h-4 opacity-100"
                />
              </div>

              <div className="flex flex-col w-[50%] ml-2 ">
                <div className="text-[12px] font-semibold text-gray-700">
                  VN-30
                </div>
                <div className="text-[12px] tracking-wider">
                  {marketData.vn30.indexValue}
                </div>
              </div>

              <div
                className={`flex flex-col items-end w-[30%] ml-2 text-[12px] tracking-wide ${getTextColor(
                  marketData.vnindex.data
                )}`}
              >
                <div className="font-semibold">
                  {marketData.vn30.ratioChange}
                  {checkData(marketData.vn30.data) ? "%" : ""}
                </div>
                <div>{marketData.vn30.change}</div>
              </div>
            </div>

            <div className="flex bg-white border border-gray-200 rounded-lg p-2 w-[23%] ">
              <div
                className={`p-2 rounded-lg self-center flex justify-center items-center ${getBgColor(
                  marketData.hnx30.data
                )} `}
              >
                <img
                  src={getStatusArrow(marketData.hnx30.data)}
                  alt={"Down Arrow"}
                  className="w-4 h-4 opacity-100"
                />
              </div>

              <div className="flex flex-col w-[50%] ml-2 ">
                <div className="text-[12px] font-semibold text-gray-700">
                  HNX-30
                </div>
                <div className="text-[12px] tracking-wider">
                  {marketData.hnx30.indexValue}
                </div>
              </div>

              <div
                className={`flex flex-col items-end w-[30%] ml-2 text-[12px] ${getTextColor(
                  marketData.vnindex.data
                )}`}
              >
                <div className="font-semibold">
                  {marketData.hnx30.ratioChange}
                  {checkData(marketData.hnx30.data) ? "%" : ""}
                </div>
                <div className="tracking-wider">{marketData.hnx30.change}</div>
              </div>
            </div>
=======
          <div className="flex flex-row items-center justify-between w-full mt-2">
            <MarketCard
              IndexName={"VNINDEX"}
              Change={marketData.vnindex.data[0].Change}
              IndexValue={marketData.vnindex.data[0].IndexValue}
              RatioChange={marketData.vnindex.data[0].RatioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"VN30"}
              Change={marketData.vn30.data[0].Change}
              IndexValue={marketData.vn30.data[0].IndexValue}
              RatioChange={marketData.vn30.data[0].RatioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"HNXINDEX"}
              Change={marketData.hnxindex.data[0].Change}
              IndexValue={marketData.hnxindex.data[0].IndexValue}
              RatioChange={marketData.hnxindex.data[0].RatioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"HNX30"}
              Change={marketData.hnx30.data[0].Change}
              IndexValue={marketData.hnx30.data[0].IndexValue}
              RatioChange={marketData.hnx30.data[0].RatioChange}
              isExpanded={isExpanded}
            />
>>>>>>> web_dev
          </div>
        )}

        {isExpanded && (
          <div className="flex w-full h-[400px] border border-gray-100 rounded-xl shadow-md items-center justify-between my-[10px] px-6 py-4">
            <div className="flex flex-col w-[60%] h-full">
              <div className="flex items-center justify-between font-semibold text-gray-500 text-[15px]">
                <button className="px-5 hover:bg-gray-100">1 Day</button>
                <button className="px-5 hover:bg-gray-100">1 Week </button>
                <button className="px-5 hover:bg-gray-100">1 Month</button>
                <button className="px-5 hover:bg-gray-100">1 Year</button>
                <button className="px-5 hover:bg-gray-100">5 Year</button>
              </div>

              <div className="flex items-center justify-center w-full h-full">
                {/* <MarketsGraph /> */}
              </div>
            </div>
<<<<<<< HEAD
            <div className="flex flex-col w-[40%] h-full ml-6 items-center justify-center  font-semibold text-[15px]">
              <div className="flex items-center justify-between w-full my-3 text-gray-600 rounded-md hover:bg-gray-100">
                <div className="w-[6px] h-[20px] rounded-l-sm rounded-r-sm bg-red-500"></div>
                <span className="flex ml-2 w-[25%]">VN-INDEX</span>
                <span className="flex items-center justify-end w-[25%]">
                  {marketData.vnindex.indexValue}
                </span>
                <span
                  className={`flex items-center justify-end w-[20%] mr-4 ${getTextColor(
                    marketData.vnindex.data
                  )}`}
                >
                  {marketData.vnindex.change}
                </span>
                <div className="flex items-center justify-end w-[30%]">
                  <div
                    className={`flex w-full items-center justify-center py-[4px] rounded-md px-1 ${getBgColor(
                      marketData.vnindex.data
                    )}`}
                  >
                    <img
                      src={getStatusArrow(marketData.vnindex.data)}
                      alt={"Arrow Down"}
                      className=" w-5 mr-[3px]"
                    />
                    <span
                      className={`${getTextColor(marketData.vnindex.data)}`}
                    >
                      {marketData.vnindex.ratioChange}{" "}
                      {checkData(marketData.vnindex.data) ? "%" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full my-3 text-gray-600 rounded-md hover:bg-gray-100">
                <div className="w-[6px] h-[20px] rounded-l-sm rounded-r-sm bg-yellow-500"></div>
                <span className="flex ml-2 w-[25%]">HNX-INDEX</span>
                <span className="flex items-center justify-end w-[25%]">
                  {marketData.hnxindex.indexValue}
                </span>
                <span
                  className={`flex items-center justify-end w-[20%] mr-4 ${getTextColor(
                    marketData.hnxindex.data
                  )}`}
                >
                  {marketData.hnxindex.change}
                </span>
                <div className="flex items-center justify-end w-[30%]">
                  <div
                    className={`flex w-full items-center justify-center py-[4px] rounded-md px-1 ${getBgColor(
                      marketData.hnxindex.data
                    )}`}
                  >
                    <img
                      src={getStatusArrow(marketData.hnxindex.data)}
                      alt={"Arrow Down"}
                      className=" w-5 mr-[3px]"
                    />
                    <span
                      className={`${getTextColor(marketData.hnxindex.data)}`}
                    >
                      {marketData.hnxindex.ratioChange}{" "}
                      {checkData(marketData.hnxindex.data) ? "%" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full my-3 text-gray-600 rounded-md hover:bg-gray-100">
                <div className="w-[6px] h-[20px] rounded-l-sm rounded-r-sm bg-blue-500"></div>
                <span className="flex ml-2 w-[25%]">VN-30</span>
                <span className="flex items-center justify-end w-[25%]">
                  {marketData.vn30.indexValue}
                </span>
                <span
                  className={`flex items-center justify-end w-[20%] mr-4 ${getTextColor(
                    marketData.vn30.data
                  )}`}
                >
                  {marketData.vn30.change}
                </span>
                <div className="flex items-center justify-end w-[30%]">
                  <div
                    className={`flex w-full items-center justify-center py-[4px] rounded-md px-1 ${getBgColor(
                      marketData.vn30.data
                    )}`}
                  >
                    <img
                      src={getStatusArrow(marketData.vn30.data)}
                      alt={"Arrow Down"}
                      className=" w-5 mr-[3px]"
                    />
                    <span className={`${getTextColor(marketData.vn30.data)}`}>
                      {marketData.vn30.ratioChange}{" "}
                      {checkData(marketData.vn30.data) ? "%" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full my-3 text-gray-600 rounded-md hover:bg-gray-100">
                <div className="w-[6px] h-[20px] rounded-l-sm rounded-r-sm bg-green-500"></div>
                <span className="flex ml-2 w-[25%]">HNX-30</span>
                <span className="flex items-center justify-end w-[25%]">
                  {marketData.hnx30.indexValue}
                </span>
                <span
                  className={`flex items-center justify-end w-[20%] mr-4 ${getTextColor(
                    marketData.hnx30.data
                  )}`}
                >
                  {marketData.hnx30.change}
                </span>
                <div className="flex items-center justify-end w-[30%]">
                  <div
                    className={`flex w-full items-center justify-center py-[4px] rounded-md px-1 ${getBgColor(
                      marketData.hnx30.data
                    )}`}
                  >
                    <img
                      src={getStatusArrow(marketData.hnx30.data)}
                      alt={"Arrow Down"}
                      className=" w-5 mr-[3px]"
                    />
                    <span className={`${getTextColor(marketData.hnx30.data)}`}>
                      {marketData.hnx30.ratioChange}{" "}
                      {checkData(marketData.hnx30.data) ? "%" : ""}
                    </span>
                  </div>
                </div>
              </div>
=======

            <div className="flex flex-col w-[40%] h-full ml-6 items-center justify-center  font-semibold text-[15px]">
              <MarketCard
                IndexName={"VNINDEX"}
                Change={marketData.vnindex.data[0].Change}
                IndexValue={marketData.vnindex.data[0].IndexValue}
                RatioChange={marketData.vnindex.data[0].RatioChange}
                isExpanded={isExpanded}
              />
              <MarketCard
                IndexName={"VN30"}
                Change={marketData.vn30.data[0].Change}
                IndexValue={marketData.vn30.data[0].IndexValue}
                RatioChange={marketData.vn30.data[0].RatioChange}
                isExpanded={isExpanded}
              />
              <MarketCard
                IndexName={"HNXINDEX"}
                Change={marketData.hnxindex.data[0].Change}
                IndexValue={marketData.hnxindex.data[0].IndexValue}
                RatioChange={marketData.hnxindex.data[0].RatioChange}
                isExpanded={isExpanded}
              />
              <MarketCard
                IndexName={"HNX30"}
                Change={marketData.hnx30.data[0].Change}
                IndexValue={marketData.hnx30.data[0].IndexValue}
                RatioChange={marketData.hnx30.data[0].RatioChange}
                isExpanded={isExpanded}
              />
>>>>>>> web_dev
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;
