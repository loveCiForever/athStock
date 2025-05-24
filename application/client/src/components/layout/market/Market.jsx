import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";

import MarketCard from "../../ui/card/MarketCard";

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

const Market = ({ onSelectIndex }) => {
  const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const [vnindexData, setvnindexData] = useState([
    {
      IndexValue: 0,
      Change: 0,
      RatioChange: 0,
    },
  ]);

  const [vn30Data, setvn30Data] = useState([
    {
      IndexValue: 0,
      Change: 0,
      RatioChange: 0,
    },
  ]);
  const [hnxindexData, sethnxindexData] = useState([
    {
      IndexValue: 0,
      Change: 0,
      RatioChange: 0,
    },
  ]);
  const [hnx30Data, sethnx30Data] = useState([
    {
      IndexValue: 0,
      Change: 0,
      RatioChange: 0,
    },
  ]);

  const dataMap = {
    VNINDEX: vnindexData,
    VN30: vn30Data,
    HNXINDEX: hnxindexData,
    HNX30: hnx30Data,
  };

  useEffect(() => {
    const formatDate = (date) => {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const y = date.getFullYear();
      return `${d}/${m}/${y}`;
    };

    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - 30);

    const fetchCurrentIndex = () => {
      const indexes = ["VNINDEX", "HNXINDEX", "VN30", "HNX30"];

      indexes.forEach(async (idx) => {
        const payload = {
          indexId: idx,
          fromDate: formatDate(from),
          toDate: formatDate(to),
          pageIndex: 1,
          pageSize: 10,
          ascending: false,
        };

        try {
          const res = await axios.post(
            "http://localhost:3000/ssi/DailyIndex",
            payload
          );

          // console.log(res);

          if (res.data.status !== 429 && res.data.data?.[0]) {
            const item = res.data.data;
            if (idx === "VNINDEX") setvnindexData(item);
            else if (idx === "VN30") setvn30Data(item);
            else if (idx === "HNXINDEX") sethnxindexData(item);
            else if (idx === "HNX30") sethnx30Data(item);
          }
        } catch (err) {
          console.error(`Error fetching ${idx}:`, err);
        }
      });
    };

    fetchCurrentIndex();
    const intervalId = setInterval(fetchCurrentIndex, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const chartData = useMemo(() => {
    const data = vnindexData.map((item, idx) => ({
      TradingDate: item.TradingDate,
      vnindex: parseFloat(item.IndexValue),
      vn30: parseFloat(vn30Data[idx]?.IndexValue ?? 0),
      hnxindex: parseFloat(hnxindexData[idx]?.IndexValue ?? 0),
      hnx30: parseFloat(hnx30Data[idx]?.IndexValue ?? 0),
    }));

    return data.sort((a, b) => {
      const [da, ma, ya] = a.TradingDate.split("/").map(Number);
      const [db, mb, yb] = b.TradingDate.split("/").map(Number);
      return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
    });
  }, [vnindexData, vn30Data, hnxindexData, hnx30Data]);

  //   if (vnindexData) console.log(vnindexData);

  return (
    <div className="flex flex-col w-[1300px] bg-red-200// ">
      <div className="flex flex-col items-start">
        <button
          className={`flex items-center justify-center uppercase tracking-widest font-bold text-[15px] text-black gap-2 `}
          onClick={handleExpandClick}
        >
          {isExpanded ? (
            <ChevronsUpDown size={20} />
          ) : (
            <ChevronsDownUp size={20} />
          )}
          Visualize
        </button>

        {!isExpanded && (
          <div className="flex flex-row items-center justify-between w-full mt-2">
            {["VNINDEX", "VN30", "HNXINDEX", "HNX30"].map((idx) => {
              const arr = dataMap[idx] || [];
              const first = arr[0] || {
                IndexValue: 0,
                Change: 0,
                RatioChange: 0,
              };

              return (
                <MarketCard
                  key={idx}
                  IndexName={idx}
                  onClick={() => onSelectIndex(idx)}
                  Change={first.Change}
                  IndexValue={first.IndexValue}
                  RatioChange={first.RatioChange}
                  isExpanded={isExpanded}
                />
              );
            })}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex w-full items-center justify-between mt-4 pr-4 bg-white rounded-lg border-[1px] border-gray-100 shadow-xl">
          <div className="w-[70%] py-10 bg-red-100//">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis
                  dataKey="TradingDate"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  domain={[
                    (dataMin) => dataMin - 200,
                    (dataMax) => dataMax + 200,
                  ]}
                  tickFormatter={(v) => v.toFixed(0)}
                />
                <Tooltip formatter={(val, name) => [val, name]} />
                <Legend verticalAlign="top" />
                <Line
                  dataKey="vnindex"
                  name="VN-Index"
                  stroke="#22c55e"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  dataKey="hnxindex"
                  name="HNX-Index"
                  dot={false}
                  stroke="#ef4444"
                  strokeWidth={2}
                />
                <Line
                  dataKey="vn30"
                  name="VN30"
                  dot={false}
                  strokeWidth={2}
                  stroke="#3b82f6"
                />
                <Line
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
              Change={vnindexData[0].Change}
              IndexValue={vnindexData[0].IndexValue}
              RatioChange={vnindexData[0].RatioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"VN30"}
              Change={vn30Data[0].Change}
              IndexValue={vn30Data[0].IndexValue}
              RatioChange={vn30Data[0].RatioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"HNXINDEX"}
              Change={hnxindexData[0].Change}
              IndexValue={hnxindexData[0].IndexValue}
              RatioChange={hnxindexData[0].RatioChange}
              isExpanded={isExpanded}
            />
            <MarketCard
              IndexName={"HNX30"}
              Change={hnx30Data[0].Change}
              IndexValue={hnx30Data[0].IndexValue}
              RatioChange={hnx30Data[0].RatioChange}
              isExpanded={isExpanded}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
