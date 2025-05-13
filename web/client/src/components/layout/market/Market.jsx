import React, { use, useEffect, useMemo, useState } from "react";

import vnindex_data from "../../../../../../data/index/vnindex/vnindex.json";
import hnxindex_data from "../../../../../../data/index/hnxindex/hnxindex.json";
import vn30_data from "../../../../../../data/index/vn30/vn30.json";
import hnx30_data from "../../../../../../data/index/hnx30/hnx30.json";

import CollapseAllIcon from "../../../assets/icons/collapseAllIcon.png";
import ExpandAllIcon from "../../../assets/icons/expandAllIcon.png";
import MarketCard from "../../ui/cards/MarketCard";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import axios from "axios";

const Market = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const [vnindexData, setVnindexData] = useState(vnindex_data);
  const [hnxindexData, setHnxindexData] = useState(hnxindex_data);
  const [vn30Data, setVn30Data] = useState(vn30_data);
  const [hnx30Data, setHnx30Data] = useState(hnx30_data);

  // useEffect(() => {
  //   console.log(vnindexData);
  // }, [vnindexData]);

  // useEffect(() => {
  //   console.log(hnxindexData);
  // }, [hnxindexData]);

  // useEffect(() => {
  //   console.log(vn30Data);
  // }, [vn30Data]);

  // useEffect(() => {
  //   console.log(hnx30Data);
  // }, [hnx30Data]);

  const getLatestIndexData = (indexData) => {
    if (!indexData) return null;

    const dates = Object.keys(indexData.data.data);
    if (dates.length === 0) return null;

    const latestDate = dates.sort().pop();
    const latestData = indexData.data.data[latestDate];

    const open = parseFloat(latestData.open);
    const close = parseFloat(latestData.close);

    return {
      change: (close - open).toFixed(2),
      indexValue: close.toFixed(2),
      ratioChange: (((close - open) / open) * 100).toFixed(2) + "%",
    };
  };

  const currentVnIndex = getLatestIndexData(vnindexData) || {
    change: 0,
    indexValue: 0,
    ratioChange: "0%",
  };
  const currentHnxIndex = getLatestIndexData(hnxindexData) || {
    change: 0,
    indexValue: 0,
    ratioChange: "0%",
  };
  const currentVn30 = getLatestIndexData(vn30Data) || {
    change: 0,
    indexValue: 0,
    ratioChange: "0%",
  };
  const currentHnx30 = getLatestIndexData(hnx30Data) || {
    change: 0,
    indexValue: 0,
    ratioChange: "0%",
  };

  const buildChartData = () => {
    if (!vnindexData || !hnxindexData || !vn30Data || !hnx30Data) return [];

    const vnDates = Object.keys(vnindexData.data.data);
    const hnxDates = Object.keys(hnxindexData.data.data);
    const vn30Dates = Object.keys(vn30Data.data.data);
    const hnx30Dates = Object.keys(hnx30Data.data.data);

    // Intersection of dates to avoid missing data.
    const commonDates = vnDates
      .filter(
        (date) =>
          hnxDates.includes(date) &&
          vn30Dates.includes(date) &&
          hnx30Dates.includes(date)
      )
      .sort(); // earliest to latest

    // Keep only last 2 years of data.
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const chartData = commonDates
      .filter((date) => new Date(date) >= twoYearsAgo)
      .map((date) => ({
        time: new Date(date).getTime(),
        vnindex: parseFloat(vnindexData.data.data[date].close),
        hnxindex: parseFloat(hnxindexData.data.data[date].close),
        vn30: parseFloat(vn30Data.data.data[date].close),
        hnx30: parseFloat(hnx30Data.data.data[date].close),
      }));

    return chartData;
  };

  const dataLast2Years = useMemo(
    () => buildChartData(),
    [vnindexData, hnxindexData, vn30Data, hnx30Data]
  );

  const monthFmt = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  });

  // Pick a tick for each 3 months or so:
  const monthTicks = dataLast2Years.length
    ? dataLast2Years
        .map((d) => d.time)
        .filter((_, idx) => idx % Math.ceil(dataLast2Years.length / 8) === 0)
    : [];

  return (
    <div className="flex flex-col w-[1300px] bg-red-200// ">
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
              Change={currentVnIndex.change}
              IndexValue={currentVnIndex.indexValue}
              RatioChange={currentVnIndex.ratioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"VN30"}
              Change={currentVn30.change}
              IndexValue={currentVn30.indexValue}
              RatioChange={currentVn30.ratioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"HNXINDEX"}
              Change={currentHnxIndex.change}
              IndexValue={currentHnxIndex.indexValue}
              RatioChange={currentHnxIndex.ratioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"HNX30"}
              Change={currentHnx30.change}
              IndexValue={currentHnx30.indexValue}
              RatioChange={currentHnx30.ratioChange}
              isExpanded={isExpanded}
            />
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex w-full items-center justify-between mt-4 pr-4 bg-white rounded-lg border-[1px] border-gray-100 shadow-xl">
          <div className="w-[70%] py-10 bg-red-100//">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={dataLast2Years}
                margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
              >
                <CartesianGrid strokeDasharray="1" />

                <XAxis
                  dataKey="time"
                  type="number"
                  scale="time"
                  domain={[
                    dataLast2Years[0].time,
                    dataLast2Years[dataLast2Years.length - 1].time,
                  ]}
                  ticks={monthTicks}
                  tickFormatter={(ts) => monthFmt.format(new Date(ts))}
                  axisLine={false}
                  tickLine={false}
                  padding={{ top: 0, right: 0, bottom: 0, left: 40 }}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                />

                <YAxis
                  yAxisId="price"
                  orientation="left"
                  domain={["dataMin - 10", "dataMax + 10"]}
                  tickFormatter={(v) => v.toFixed(0)}
                />

                <Tooltip
                  labelFormatter={(ts) => new Date(ts).toLocaleDateString()}
                  formatter={(val, name) => [val, name.toUpperCase()]}
                />

                <Line
                  yAxisId="price"
                  dataKey="vnindex"
                  name="VN-Index"
                  stroke="#22c55e"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="price"
                  dataKey="hnxindex"
                  name="HNX-Index"
                  stroke="#ef4444"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="price"
                  dataKey="vn30"
                  name="VN30"
                  stroke="#3b82f6"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="price"
                  dataKey="hnx30"
                  name="HNX30"
                  stroke="#eab308"
                  dot={false}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col h-[300px] w-[35%] ml-6 items-center justify-between font-semibold text-[15px] bg-red-100//">
            <MarketCard
              IndexName={"VNINDEX"}
              Change={currentVnIndex.change}
              IndexValue={currentVnIndex.indexValue}
              RatioChange={currentVnIndex.ratioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"VN30"}
              Change={currentVn30.change}
              IndexValue={currentVn30.indexValue}
              RatioChange={currentVn30.ratioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"HNXINDEX"}
              Change={currentHnxIndex.change}
              IndexValue={currentHnxIndex.indexValue}
              RatioChange={currentHnxIndex.ratioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"HNX30"}
              Change={currentHnx30.change}
              IndexValue={currentHnx30.indexValue}
              RatioChange={currentHnx30.ratioChange}
              isExpanded={isExpanded}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
