import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BlinkBlur } from "react-loading-indicators";
import { ThemeContext } from "../../../hooks/useTheme";
import { DEVELOPMENT_STOCK_SERVER_BASE_URL } from "../../../utils/config";
import { getStockCache, setStockCache } from "../../../utils/stockCache";
import StockCard from "../../ui/card/StockCard";
import { TruncateString } from "../../../utils/formatString";
import useSocket from "../../../hooks/useSocket";
import ChartModal from "./ChartModal";
import { formatDateViEn } from "../../../utils/formatDate.jsx";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Stock = ({ indexId }) => {
  const [stocks, setStocks] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const { theme } = useContext(ThemeContext);

  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const handleStockClick = async (symbol) => {
    setIsLoadingList(true);
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const toDate = formatDateViEn(today);
      const fromDate = formatDateViEn(thirtyDaysAgo);

      const response = await axios.post(
        "http://localhost:3000/ssi/IntradayOhlc",
        {
          symbol,
          fromDate,
          toDate,
          pageSize: 9999,
          ascending: true,
        }
      );

      // Check for the nested data structure
      if (response.data?.success && response.data?.data?.data) {
        const chartData = response.data.data.data;
        console.log("Setting chart data:", chartData); // Debug log
        setChartData(chartData);
        setSelectedSymbol(symbol);
        setShowChart(true);
      } else {
        console.error("Invalid data structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  async function fetchIndexComponents(indexId) {
    const indexMap = {
      vnindex: "VN100",
      vn30: "VN30",
      hnxindex: "HNX30",
      hnx30: "HNX30",
    };

    const indexCode = indexMap[indexId.toLowerCase()] || "VN30";

    try {
      const response = await fetch(
        "http://localhost:3000/ssi/IndexComponents",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            indexCode,
            pageIndex: 1,
            pageSize: 100,
          }),
        }
      );
      const result = await response.json();
      const components = result?.data?.[0]?.IndexComponent || [];
      return components.map((item) => item.StockSymbol);
    } catch (err) {
      console.error("Fetch index component error", err);
      return [];
    }
  }

  async function fetchCompanyName(symbol) {
    const cached = localStorage.getItem("stockCache");
    const cacheData = cached ? JSON.parse(cached) : {};

    if (cacheData[symbol]) return cacheData[symbol];

    try {
      const response = await fetch(
        "http://localhost:3000/ssi/SecuritiesDetails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            market: "HOSE",
            symbol,
            pageIndex: 1,
            pageSize: 100,
          }),
        }
      );

      const result = await response.json();
      const name = result?.data?.[0]?.RepeatedInfo?.[0]?.SymbolEngName;
      if (name) {
        cacheData[symbol] = name;
        localStorage.setItem("stockCache", JSON.stringify(cacheData));
        return name;
      }
    } catch (err) {
      console.error(`Error fetching company name for ${symbol}`, err);
    }

    return null;
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingList(true);
        const symbols = await fetchIndexComponents(indexId);
        const stockData = [];

        for (let symbol of symbols) {
          const name = await fetchCompanyName(symbol);
          if (name) stockData.push({ symbol, name });
        }

        setStocks(stockData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoadingList(false);
      }
    };

    loadData();
  }, [indexId]);

  // useEffect(() => {
  //   if (stockTrade) {
  //     setStocks((prevStocks) => {
  //       return prevStocks.map((stock) => {
  //         if (stock.symbol === stockTrade.Symbol) {
  //           return {
  //             ...stock,
  //             open: stockTrade.OpenPrice || stock.open,
  //             high: stockTrade.HighestPrice || stock.high,
  //             close: stockTrade.MatchPrice || stock.close,
  //             low: stockTrade.LowestPrice || stock.low,
  //             volume: stockTrade.TotalTradingQty || stock.volume,
  //           };
  //         }
  //         return stock;
  //       });
  //     });
  //   }
  // }, [stockTrade]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       setIsLoadingList(true);
  //       const symbols = await fetchIndexComponents(indexId);
  //       const stockData = [];

  //       for (let symbol of symbols) {
  //         const name = await fetchCompanyName(symbol);
  //         if (name)
  //           stockData.push({
  //             symbol,
  //             name,
  //             open: 0,
  //             high: 0,
  //             close: 0,
  //             low: 0,
  //             volume: 0,
  //           });
  //       }

  //       setStocks(stockData);

  //       switchChannel(`X-TRADE:${symbols.join("-")}`);
  //     } catch (error) {
  //       console.error("Error loading data:", error);
  //     } finally {
  //       setIsLoadingList(false);
  //     }
  //   };

  //   loadData();
  // }, [indexId]);

  // useEffect(() => {
  //   if (stockTrade) {
  //     setStocks((prevStocks) => {
  //       return prevStocks.map((stock) => {
  //         if (stock.symbol === stockTrade.Symbol) {
  //           return {
  //             ...stock,
  //             open: stockTrade.OpenPrice || stock.open,
  //             high: stockTrade.HighestPrice || stock.high,
  //             close: stockTrade.MatchPrice || stock.close,
  //             low: stockTrade.LowestPrice || stock.low,
  //             volume: stockTrade.TotalTradingQty || stock.volume,
  //           };
  //         }
  //         return stock;
  //       });
  //     });
  //   }
  // }, [stockTrade]);

  if (isLoadingList) {
    return (
      <div className="flex flex-col w-full items-center mt-10">
        <BlinkBlur color="#fdff12" size="large" />
        <h1 className="mt-5 text-2xl font-bold animate-pulse">
          Loading {indexId} ...
        </h1>
      </div>
    );
  }

  // stocks.map((stock) => {
  //   console.log(stock);
  // });

  return (
    <div
      className={`${
        theme === "dark-theme" ? "text-white" : "text-black"
      } w-full`}
    >
      <h2 className="text-xl font-bold mb-4">
        Danh sách cổ phiếu ({indexId.toUpperCase()})
      </h2>
      <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1fr] p-2 font-bold bg-black/20 w-full mb-2 gap-2 text-right">
        <span className="text-left">Mã</span>
        <span className="text-left">Công ty</span>
        <span className="">Giá mở cửa</span>
        <span className="">Giá trần</span>
        <span className="">Giá đóng cửa</span>
        <span className="">Giá sàn</span>
        <span className="">Khối lượng</span>
      </div>
      {stocks.map((stock) => (
        <StockCard
          key={stock.symbol}
          Symbol={stock.symbol}
          SymbolName={stock.name}
          Open={stock.open}
          High={stock.high}
          Close={stock.close}
          Low={stock.low}
          Volume={stock.volume}
          onClick={handleStockClick}
        />
      ))}

      {showChart && (
        <ChartModal
          isOpen={showChart}
          onClose={() => setShowChart(false)}
          data={chartData}
          symbol={selectedSymbol}
        />
      )}
    </div>
  );
};

export default Stock;
