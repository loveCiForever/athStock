import { useEffect, useState } from "react";
import axios from "axios";

import CollapseAllIcon from "../../../assets/icon/collapseAllIcon.png";
import ExpandAllIcon from "../../../assets/icon/expandAllIcon.png";

import MarketCard from "../../ui/card/MarketCard";

// import MarketsGraph from "./MarketsGraph";

const Market = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [marketData, setMarketData] = useState({
    vnindex: {
      data: [
        {
          IndexValue: 1200.5,

          Change: +15.25,
          RatioChange: +1.28,
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

          Change: +2.1,
          RatioChange: +0.84,
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

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col w-[1200px] bg-red-200//">
      <div className="flex flex-col items-start">
        <button
          className={`flex items-center justify-center uppercase text-gray-800 tracking-widest font-bold text-[14px] `}
          onClick={handleExpandClick}
        >
          <img
            className="h-5 w-5 mr-[6px]"
            src={isExpanded ? CollapseAllIcon : ExpandAllIcon}
            alt={isExpanded ? "Collapse All Icon" : "Expand All Icon"}
          />
          Visualize
        </button>

        {!isExpanded && (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;
