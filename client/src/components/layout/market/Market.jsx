import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import CollapseAllIcon from "../../../assets/icons/collapseAllIcon.png";
import ExpandAllIcon from "../../../assets/icons/expandAllIcon.png";
import MarketCard from "../../ui/cards/MarketCard";
import vnindex_data from "../../../../../data/index/vnindex/vnindex.json";
import hnxindex_data from "../../../../../data/index/hnxindex/hnxindex.json";
import hnx30 from "../../../../../data/index/hnx30/hnx30.json";
import vn30 from "../../../../../data/index/vn30/vn30.json";
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
  Bar,
} from "recharts";

const Market = () => {
  const data = useMemo(() => vnindex_data, [vnindex_data]);
  const monthTicks = useMemo(() => {
    if (data.length === 0) return [];

    const ticks = [];
    let lastMonth = null;

    data.forEach((d) => {
      const dt = new Date(d.time);
      const m = dt.getMonth();

      if (dt.getDate() === 1 && m !== lastMonth) {
        ticks.push(d.time);
        lastMonth = m;
      }
    });

    const lastTime = data[data.length - 1].time;
    if (ticks[ticks.length - 1] !== lastTime) {
      ticks.push(lastTime);
    }

    return ticks;
  }, [data]);

  const monthFmt = new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full bg-white rounded-xl">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={data}
          margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
        >
          <CartesianGrid strokeDasharray="2 3" />
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={[data[0].time, data[data.length - 1].time]}
            ticks={monthTicks}
            tickFormatter={(ts) => monthFmt.format(new Date(ts))}
            axisLine={false}
            tickLine={false}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis
            yAxisId="price"
            orientation="left"
            domain={["dataMin - 10", "dataMax + 10"]}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis
            yAxisId="vol"
            orientation="right"
            domain={[0, "dataMax"]}
            tickFormatter={(value) => `${(value / 1e9).toFixed(1)}B`}
          />
          <Tooltip
            labelFormatter={(ts) => new Date(ts).toLocaleDateString()}
            formatter={(val, name) => [
              val,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="close"
            name="Close"
            stroke="#23a723"
            dot={false}
            strokeWidth={2}
          />

          <Bar
            yAxisId="vol"
            dataKey="volume"
            name="Volume"
            barSize={20}
            fill="#3B82F6"
            opacity={0.6}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Market;
