import StockCard from "../../ui/cards/StockCard";
import InfoIcon from "../../../assets/icons/infoIcon.png";
import { useEffect, useState } from "react";
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

import acb_data from "../../../../../../data/stock/acb/acb.json";
import bid_data from "../../../../../../data/stock/bid/bid.json";
import bvh_data from "../../../../../../data/stock/bvh/bvh.json";
import ctg_data from "../../../../../../data/stock/ctg/ctg.json";
import fpt_data from "../../../../../../data/stock/fpt/fpt.json";
import mbb_data from "../../../../../../data/stock/mbb/mbb.json";
import ssi_data from "../../../../../../data/stock/ssi/ssi.json";
import tpb_data from "../../../../../../data/stock/tpb/tpb.json";
import vcb_data from "../../../../../../data/stock/vcb/vcb.json";
import vib_data from "../../../../../../data/stock/vib/vib.json";
import vic_data from "../../../../../../data/stock/vic/vic.json";
import vjc_data from "../../../../../../data/stock/vjc/vjc.json";
import { UppercaseFullString } from "../../../utils/formatText";

const MayBeYouCare = () => {
  const [acbData, setAcbData] = useState(acb_data);
  const [bidData, setBidData] = useState(bid_data);
  const [bvhData, setBvhData] = useState(bvh_data);
  const [ctgData, setCtgData] = useState(ctg_data);
  const [fptData, setFptData] = useState(fpt_data);
  const [mbbData, setMbbData] = useState(mbb_data);
  const [ssiData, setSsiData] = useState(ssi_data);
  const [tpbData, setTpbData] = useState(tpb_data);
  const [vcbData, setVcbData] = useState(vcb_data);
  const [vibData, setVibData] = useState(vib_data);
  const [vicData, setVicData] = useState(vic_data);
  const [vjcData, setVjcData] = useState(vjc_data);

  // useEffect(() => {
  //   console.log(acbData);
  // }, [acbData]);

  const getLatestStockData = (stockData) => {
    if (!stockData) return null;

    const dates = Object.keys(stockData.data.data);
    if (dates.length === 0) return null;

    const latestDate = dates.sort().pop();
    const latestData = stockData.data.data[latestDate];

    const open = parseFloat(latestData.open);
    const close = parseFloat(latestData.close);

    return {
      change: (close - open).toFixed(2),
      currentPrice: close.toFixed(2),
      ratioChange: (((close - open) / open) * 100).toFixed(2),
    };
  };

  const currentAcb = getLatestStockData(acbData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };

  const currentBid = getLatestStockData(bidData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentBvh = getLatestStockData(bvhData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentCtg = getLatestStockData(ctgData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentFpt = getLatestStockData(fptData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentMbb = getLatestStockData(mbbData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentSsi = getLatestStockData(ssiData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentTpb = getLatestStockData(tpbData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentVcb = getLatestStockData(vcbData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentVib = getLatestStockData(vibData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentVic = getLatestStockData(vicData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };
  const currentVjc = getLatestStockData(vjcData) || {
    change: 0,
    currentPrice: 0,
    ratioChange: 0,
  };

  const [selectedStockCard, setSelectedStockCard] = useState(null);

  return (
    <div className="flex flex-col items-start justify-center w-[800px] bg-red-100//">
      <div className="flex items-center justify-start w-full mb-4">
        <h1 className="text-xl font-semibold text-gray-600">May be you care</h1>
        <div className="relative inline-block group">
          <button className="focus:outline-none">
            <img
              src={InfoIcon}
              alt="Info"
              className="w-[17px] mb-[2px] ml-[7px]"
            />
          </button>
          <span className="absolute left-1/2 transform -translate-x-1/2 mt-[30px] w-[200px] p-[10px] bg-white border-[2px] shadow-sm text-gray-700 text-sm rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none tracking-normal font-inter// text-[14px]">
            The system relies on your recent search content, the types of
            securities you follow, and other activities to generate this list
          </span>
        </div>
      </div>

      <StockCard
        symbol={acbData.data.symbol}
        companyName={acbData.data.company_name}
        change={currentAcb.change}
        currentPrice={currentAcb.currentPrice}
        ratioChange={currentAcb.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: acbData.data.symbol,
            companyName: acbData.data.company_name,
            data: acbData.data.data,
          })
        }
      />

      <StockCard
        symbol={bidData.data.symbol}
        companyName={bidData.data.company_name}
        change={currentBid.change}
        currentPrice={currentBid.currentPrice}
        ratioChange={currentBid.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: bidData.data.symbol,
            companyName: bidData.data.company_name,
            data: bidData.data.data,
          })
        }
      />

      <StockCard
        symbol={bvhData.data.symbol}
        companyName={bvhData.data.company_name}
        change={currentBvh.change}
        currentPrice={currentBvh.currentPrice}
        ratioChange={currentBvh.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: bvhData.data.symbol,
            companyName: bvhData.data.company_name,
            data: bvhData.data.data,
          })
        }
      />

      <StockCard
        symbol={ctgData.data.symbol}
        companyName={ctgData.data.company_name}
        change={currentCtg.change}
        currentPrice={currentCtg.currentPrice}
        ratioChange={currentCtg.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: ctgData.data.symbol,
            companyName: ctgData.data.company_name,
            data: ctgData.data.data,
          })
        }
      />

      <StockCard
        symbol={fptData.data.symbol}
        companyName={fptData.data.company_name}
        change={currentFpt.change}
        currentPrice={currentFpt.currentPrice}
        ratioChange={currentFpt.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: fptData.data.symbol,
            companyName: fptData.data.company_name,
            data: fptData.data.data,
          })
        }
      />

      <StockCard
        symbol={mbbData.data.symbol}
        companyName={mbbData.data.company_name}
        change={currentMbb.change}
        currentPrice={currentMbb.currentPrice}
        ratioChange={currentMbb.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: mbbData.data.symbol,
            companyName: mbbData.data.company_name,
            data: mbbData.data.data,
          })
        }
      />

      <StockCard
        symbol={ssiData.data.symbol}
        companyName={ssiData.data.company_name}
        change={currentSsi.change}
        currentPrice={currentSsi.currentPrice}
        ratioChange={currentSsi.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: ssiData.data.symbol,
            companyName: ssiData.data.company_name,
            data: ssiData.data.data,
          })
        }
      />

      <StockCard
        symbol={tpbData.data.symbol}
        companyName={tpbData.data.company_name}
        change={currentTpb.change}
        currentPrice={currentTpb.currentPrice}
        ratioChange={currentTpb.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: tpbData.data.symbol,
            companyName: tpbData.data.company_name,
            data: tpbData.data.data,
          })
        }
      />

      <StockCard
        symbol={vcbData.data.symbol}
        companyName={vcbData.data.company_name}
        change={currentVcb.change}
        currentPrice={currentVcb.currentPrice}
        ratioChange={currentVcb.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: vcbData.data.symbol,
            companyName: vcbData.data.company_name,
            data: vcbData.data.data,
          })
        }
      />

      <StockCard
        symbol={vibData.data.symbol}
        companyName={vibData.data.company_name}
        change={currentVib.change}
        currentPrice={currentVib.currentPrice}
        ratioChange={currentVib.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: vibData.data.symbol,
            companyName: vibData.data.company_name,
            data: vibData.data.data,
          })
        }
      />

      <StockCard
        symbol={vicData.data.symbol}
        companyName={vicData.data.company_name}
        change={currentVic.change}
        currentPrice={currentVic.currentPrice}
        ratioChange={currentVic.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: vicData.data.symbol,
            companyName: vicData.data.company_name,
            data: vicData.data.data,
          })
        }
      />

      <StockCard
        symbol={vjcData.data.symbol}
        companyName={vjcData.data.company_name}
        change={currentVjc.change}
        currentPrice={currentVjc.currentPrice}
        ratioChange={currentVjc.ratioChange}
        onClick={() =>
          setSelectedStockCard({
            symbol: vjcData.data.symbol,
            companyName: vjcData.data.company_name,
            data: vjcData.data.data,
          })
        }
      />

      {selectedStockCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-[1300px] p-10 max-h-[90vh] overflow-auto shadow-xl relative">
            <button
              onClick={() => setSelectedStockCard(null)}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {UppercaseFullString(selectedStockCard.symbol)} -{" "}
              {selectedStockCard.companyName}
            </h2>

            {/* Detailed Chart */}
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart
                data={Object.entries(selectedStockCard.data).map(
                  ([date, values]) => ({
                    date,
                    open: parseFloat(values.open),
                    high: parseFloat(values.high),
                    low: parseFloat(values.low),
                    close: parseFloat(values.close),
                    volume: parseFloat(values.volume),
                  })
                )}
                margin={{ top: 0, right: 40, bottom: 0, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  hide
                  padding={{ top: 0, right: 300, bottom: 0, left: 10 }}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="open"
                  stroke="#1c77df"
                  strokeWidth={2}
                  dot={false}
                />
                {/* <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="high"
                  stroke="#3da722"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="low"
                  stroke="#c52323"
                  strokeWidth={2}
                  dot={false}
                /> */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="close"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={false}
                />
                <Bar
                  yAxisId="right"
                  dataKey="volume"
                  fill="#a855f7"
                  barSize={30}
                  name="Volume"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MayBeYouCare;
