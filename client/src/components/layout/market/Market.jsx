import React, { use, useEffect, useMemo, useState } from "react";
import vnindex_data from "../../../../../data/index/vnindex/vnindex.json";
import hnxindex_data from "../../../../../data/index/hnxindex/hnxindex.json";
import vn30_data from "../../../../../data/index/vn30/vn30.json";
import hnx30_data from "../../../../../data/index/hnx30/hnx30.json";

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

const Market = () => {
  // cutoff timestamp for “two years ago”
  const twoYearsAgo = useMemo(() => {
    const now = new Date();
    now.setFullYear(now.getFullYear() - 2);
    return now.getTime();
  }, []);

  // lookup maps for each index’s close price
  const vnIndexMap = useMemo(
    () => Object.fromEntries(vnindex_data.map((d) => [d.time, d.close])),
    []
  );
  const hnxIndexMap = useMemo(
    () => Object.fromEntries(hnxindex_data.map((d) => [d.time, d.close])),
    []
  );
  const vn30Map = useMemo(
    () => Object.fromEntries(vn30_data.map((d) => [d.time, d.close])),
    []
  );
  const hnx30Map = useMemo(
    () => Object.fromEntries(hnx30_data.map((d) => [d.time, d.close])),
    []
  );

  // Union all timestamps and sort ascending
  const allTimes = useMemo(() => {
    const set = new Set([
      ...vnindex_data.map((d) => d.time),
      ...hnxindex_data.map((d) => d.time),
      ...vn30_data.map((d) => d.time),
      ...hnx30_data.map((d) => d.time),
    ]);
    return Array.from(set).sort((a, b) => a - b);
  }, []);

  // Merge into one array, then filter to last 2 years
  const dataLast2Years = useMemo(() => {
    return allTimes
      .filter((ts) => ts >= twoYearsAgo)
      .map((ts) => ({
        time: ts,
        vnindex: vnIndexMap[ts] ?? null,
        hnxindex: hnxIndexMap[ts] ?? null,
        vn30: vn30Map[ts] ?? null,
        hnx30: hnx30Map[ts] ?? null,
      }));
  }, [allTimes, twoYearsAgo, vnIndexMap, hnxIndexMap, vn30Map, hnx30Map]);

  // Generate ticks at the start of each month + last point
  const monthTicks = useMemo(() => {
    let lastM = null;
    const ticks = [];
    dataLast2Years.forEach((d) => {
      const dt = new Date(d.time);
      if (dt.getDate() === 1 && dt.getMonth() !== lastM) {
        ticks.push(d.time);
        lastM = dt.getMonth();
      }
    });
    const last = dataLast2Years[dataLast2Years.length - 1]?.time;
    if (last && ticks[ticks.length - 1] !== last) {
      ticks.push(last);
    }
    return ticks;
  }, [dataLast2Years]);

  // Formatter for “MMM YYYY”
  const monthFmt = new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const currentVnIndex = {
    indexValue: dataLast2Years[dataLast2Years.length - 1].vnindex,
    change: (
      (dataLast2Years[dataLast2Years.length - 1].vnindex -
        dataLast2Years[dataLast2Years.length - 2].vnindex) *
      1
    ).toFixed(2),
    ratioChange: (
      ((dataLast2Years[dataLast2Years.length - 1].vnindex -
        dataLast2Years[dataLast2Years.length - 2].vnindex) /
        dataLast2Years[dataLast2Years.length - 1].vnindex) *
      100
    ).toFixed(2),
  };
  const currentHnxIndex = {
    indexValue: dataLast2Years[dataLast2Years.length - 1].hnxindex,
    change: (
      (dataLast2Years[dataLast2Years.length - 1].hnxindex -
        dataLast2Years[dataLast2Years.length - 2].hnxindex) *
      1
    ).toFixed(2),
    ratioChange: (
      ((dataLast2Years[dataLast2Years.length - 1].hnxindex -
        dataLast2Years[dataLast2Years.length - 2].hnxindex) /
        dataLast2Years[dataLast2Years.length - 1].hnxindex) *
      100
    ).toFixed(2),
  };
  const currentVn30 = {
    indexValue: dataLast2Years[dataLast2Years.length - 1].vn30,
    change: (
      (dataLast2Years[dataLast2Years.length - 1].vn30 -
        dataLast2Years[dataLast2Years.length - 2].vn30) *
      1
    ).toFixed(2),
    ratioChange: (
      ((dataLast2Years[dataLast2Years.length - 1].vn30 -
        dataLast2Years[dataLast2Years.length - 2].vn30) /
        dataLast2Years[dataLast2Years.length - 1].vn30) *
      100
    ).toFixed(2),
  };
  const currentHnx30 = {
    indexValue: dataLast2Years[dataLast2Years.length - 1].hnx30,
    change: (
      (dataLast2Years[dataLast2Years.length - 1].hnx30 -
        dataLast2Years[dataLast2Years.length - 2].hnx30) *
      1
    ).toFixed(2),
    ratioChange: (
      ((dataLast2Years[dataLast2Years.length - 1].hnx30 -
        dataLast2Years[dataLast2Years.length - 2].hnx30) /
        dataLast2Years[dataLast2Years.length - 1].hnx30) *
      100
    ).toFixed(2),
  };
  // useEffect(() => {
  //   console.log(dataLast2Years[dataLast2Years.length - 1]);
  //   console.log(currentVnIndex);
  //   console.log(currentHnx30);
  //   console.log(currentHnxIndex);
  //   console.log(currentVn30);
  // }, [dataLast2Years]);

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
                  padding={{ top: 0, right: 0, bottom: 0, left: 10 }}
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
      {/*  */}
    </div>
  );
};

export default Market;
