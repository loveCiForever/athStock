import React, { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";

import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";

import { ThemeContext } from "../../../hooks/useTheme";
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
  ReferenceLine,
  Bar,
} from "recharts";

const StockMarket = ({ onSelectIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  const { theme } = useContext(ThemeContext);

  const [vnindexData, setVnindexData] = useState([
    {
      IndexValue: 0,
      Change: 0,
      RatioChange: 0,
      TotalVol: 0,
    },
  ]);

  const [vn30Data, setVn30Data] = useState([
    {
      IndexValue: 0,
      Change: 0,
      RatioChange: 0,
      TotalVol: 0,
    },
  ]);
  const [hnxindexData, setHnxindexData] = useState([
    {
      IndexValue: 0,
      Change: 0,
      RatioChange: 0,
      TotalVol: 0,
    },
  ]);
  const [hnx30Data, setHnx30Data] = useState([
    {
      IndexValue: 0,
      Change: 0,
      RatioChange: 0,
      TotalVol: 0,
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

          console.log(res);

          if (res.data.status !== 429 && res.data.data?.[0]) {
            const item = res.data.data;
            if (idx === "VNINDEX") setVnindexData(item);
            else if (idx === "VN30") setVn30Data(item);
            else if (idx === "HNXINDEX") setHnxindexData(item);
            else if (idx === "HNX30") setHnx30Data(item);
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
      vnindex: parseFloat(item.RatioChange),
      vn30: parseFloat(vn30Data[idx]?.RatioChange ?? 0),
      hnxindex: parseFloat(hnxindexData[idx]?.RatioChange ?? 0),
      hnx30: parseFloat(hnx30Data[idx]?.RatioChange ?? 0),
    }));

    return data.sort((a, b) => {
      const [da, ma, ya] = a.TradingDate.split("/").map(Number);
      const [db, mb, yb] = b.TradingDate.split("/").map(Number);
      return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
    });
  }, [vnindexData, vn30Data, hnxindexData, hnx30Data]);

  const yDomain = useMemo(() => {
    const allRatios = chartData.flatMap((item) => [
      item.vnindex,
      item.vn30,
      item.hnxindex,
      item.hnx30,
    ]);

    const minRatio = Math.min(...allRatios);
    const maxRatio = Math.max(...allRatios);

    const padding = (maxRatio - minRatio) * 0.1;
    return [minRatio - padding, maxRatio + padding];
  }, [chartData]);

  return (
    <div
      className={`flex flex-col w-full
        ${theme === "dark-theme" ? "text-white" : "text-black"}
        `}
    >
      <div className="flex flex-col items-start">
        <button
          className={`flex items-center w-full justify-between uppercase tracking-widest font-bold text-[15px] gap-2 `}
          onClick={handleExpandClick}
        >
          <div className={`flex gap-2 items-center`}>
            {isExpanded ? (
              <ChevronsUpDown size={20} />
            ) : (
              <ChevronsDownUp size={20} />
            )}
            <h1>Show graph</h1>
          </div>
          <h1>{now.toLocaleString("vi-VN")}</h1>
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
                  TotalVol={first.TotalVol}
                  TotalVal={first.TotalVal}
                  TradingSession={first.TradingSession}
                  Advances={first.Advances}
                  NoChanges={first.NoChanges}
                  Declines={first.Declines}
                  Ceilings={first.Ceilings}
                  Floors={first.Floors}
                  isExpanded={isExpanded}
                />
              );
            })}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex w-full items-center justify-between mt-4 pr-4 bg-white// rounded-lg border-[1px] border-gray-500 shadow-xl/">
          <div className="w-[70%] py-10 bg-red-100//">
            <h1 className="w-full text-center text-xl font-bold mb-5">test</h1>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ left: 10, right: 80 }}>
                <XAxis
                  dataKey="TradingDate"
                  type="category"
                  axisLine={true}
                  tickLine={true}
                  stroke="#ffff"
                />
                <YAxis
                  domain={[
                    (dataMin) => Math.min(dataMin, -3),
                    (dataMax) => Math.max(dataMax, 3),
                  ]}
                  tickFormatter={(v) => v.toFixed(0) + "%"}
                  axisLine={true}
                  stroke="#ffff"
                  padding={{ top: 0, bottom: 0 }}
                />
                {/* <CartesianGrid stroke="#797979" strokeDasharray="5 5" /> */}

                <ReferenceLine y={0} stroke="#ffffff" strokeWidth={1} />

                <Tooltip formatter={(val, name) => [val, name]} />
                {/* <Legend verticalAlign="top" /> */}
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

export default StockMarket;
