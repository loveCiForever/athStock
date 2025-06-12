// ./application/client/src/components/layout/market/StockMarket.jsx

import { ThemeContext } from "../../../hooks/useTheme";
import { useContext, useEffect, useState, useMemo } from "react";
import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";
import {
  isOpen,
  formatDateViEn,
  parseTradingDate,
} from "../../../utils/formatDate";
import { DEVELOPMENT_STOCK_SERVER_BASE_URL } from "../../../utils/config";
import axios from "axios";
import MarketCard from "../../ui/card/MarketCard";
import ReactApexChart from "react-apexcharts";
import useSocket from "../../../hooks/useSocket";
const StockMarket = ({ onSelectIndex }) => {
  const { theme } = useContext(ThemeContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [now, setNow] = useState(new Date());
  const [dataMap, setDataMap] = useState({
    VNINDEX: [],
    VN30: [],
    HNXINDEX: [],
    HNX30: [],
  });

  const [realtimeDataMap, setRealtimeDataMap] = useState({
    VNINDEX: [],
    VN30: [],
    HNXINDEX: [],
    HNX30: [],
  });

  const { marketData, isConnected, switchChannel } = useSocket();

  const [selectedIndex, setSelectedIndex] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (marketData && marketData.IndexId) {
      let indexKey = marketData.IndexId.toUpperCase();
      const indexMapping = {
        HNXINDEX: "HNXINDEX",
        HNX30: "HNX30",
        VNINDEX: "VNINDEX",
        VN30: "VN30",
      };
      indexKey = indexMapping[indexKey] || indexKey;

      setRealtimeDataMap((prevDataMap) => {
        const newDataMap = {
          ...prevDataMap,
          [indexKey]: [marketData, ...(prevDataMap[indexKey] || [])],
        };
        return newDataMap;
      });
    }
  }, [marketData]);

  const lineChartData = useMemo(() => {
    const indices = ["VNINDEX", "VN30", "HNXINDEX", "HNX30"];
    return indices.map((index) => ({
      name: index,
      data: isExpanded
        ? (dataMap[index] || []).map((item) => ({
            x: parseTradingDate(item.TradingDate),
            y: parseFloat(item.RatioChange),
          }))
        : [],
    }));
  }, [dataMap, isExpanded]);

  const lineChartOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        stacked: false,
        height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      stroke: {
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: "Stock Price Change Movement",
        align: "center",
        style: {
          fontSize: "20px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#b6b7b8",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0,
          opacityTo: 0,
          stops: [0, 50, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val.toFixed(2);
          },
          style: {
            colors: "#ffffff",
            fontSize: "12px",
            fontWeight: "bold",
          },
        },

        title: {
          text: "Ratio Change (%)",
          style: {
            fontSize: "18px",
            fontWeight: "bold",
            fontFamily: undefined,
            color: "#ffffff",
          },
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#ffffff",
            fontSize: "12px",
            fontWeight: "bold",
          },
        },
      },
      tooltip: {
        enabled: true,
        enabledOnSeries: undefined,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        hideEmptySeries: true,
        fillSeriesColor: false,
        onDatasetHover: {
          highlightDataSeries: false,
        },
        cssClass: "my-custom-tooltip",
        x: {
          show: true,
          format: "dd MMM",
          formatter: undefined,
        },
        marker: {
          show: true,
        },
        fixed: {
          enabled: false,
          position: "topRight",
          offsetX: 0,
          offsetY: 0,
        },
      },
      legend: {
        show: false,
      },
    }),
    []
  );

  useEffect(() => {
    const fetchStockMarketDataByRestApi = async () => {
      if (!isOpen(now) || isExpanded) {
        setIsLoading(true);
        try {
          const indices = ["VNINDEX", "VN30", "HNXINDEX", "HNX30"];
          const today = new Date();
          // console.log(today);
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);

          const fromDate = formatDateViEn(thirtyDaysAgo);
          const toDate = formatDateViEn(today);

          const responses = [];
          for (const indexId of indices) {
            try {
              if (responses.length > 0) {
                await sleep(1000);
              }

              const response = await axios.post(
                `${DEVELOPMENT_STOCK_SERVER_BASE_URL}/ssi/DailyIndex`,
                {
                  indexId,
                  fromDate,
                  toDate,
                  pageIndex: 1,
                  pageSize: 1000,
                  ascending: false,
                }
              );

              responses.push(response);

              setDataMap((prev) => ({
                ...prev,
                [indexId]: response.data.data,
              }));
            } catch (error) {
              console.error(`Error fetching ${indexId}:`, error);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStockMarketDataByRestApi();
  }, [isOpen(now), isExpanded, now]);

  return (
    <div
      className={`stock-market flex flex-col w-full
        ${theme === "dark-theme" ? "text-white" : "text-black"}
        `}
    >
      <div className="header flex flex-col items-start">
        <button
          className={`expand-button flex items-center w-full justify-between uppercase tracking-widest font-bold text-[15px] gap-2 `}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={`flex gap-2 items-center`}>
            {isExpanded ? (
              <ChevronsUpDown size={20} />
            ) : (
              <ChevronsDownUp size={20} />
            )}
            <h1>Expand</h1>
          </div>
          <div className="date-time flex gap-2">
            {now.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {<h1 className="text-gray-500">{isOpen(now) ? "" : "ĐÓNG CỬA"}</h1>}
          </div>
        </button>
        {!isExpanded && (
          <div className="flex flex-row items-center justify-between w-full mt-2">
            {["VNINDEX", "VN30", "HNXINDEX", "HNX30"].map((idx) => {
              const arr = realtimeDataMap[idx] || [];
              const first = arr[0] || {
                IndexValue: 0,
                Change: 0,
                RatioChange: 0,
              };

              return (
                <MarketCard
                  key={idx}
                  IndexName={idx}
                  onClick={() => {
                    setSelectedIndex(idx);
                    onSelectIndex(idx);
                  }}
                  Change={first.Change}
                  IndexValue={first.IndexValue}
                  RatioChange={first.RatioChange}
                  TotalVol={first.AllQty}
                  TotalVal={first.AllValue}
                  TradingSession={first.TradingSession}
                  Advances={first.Advances}
                  NoChanges={first.NoChanges}
                  Declines={first.Declines}
                  Ceilings={first.Ceilings}
                  Floors={first.Floors}
                  isExpanded={isExpanded}
                  className={`cursor-pointer ${
                    selectedIndex == idx ? "border-orange-500" : ""
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pr-4 bg-white// rounded-lg border-[1px] border-gray-500 shadow-xl/">
          <div className="flex w-full items-center justify-between">
            <div className="w-[60%] py-10 bg-red-100// px-5 //">
              {isLoading ? (
                <div
                  className={`flex flex-col items-center justify-center h-[400px]`}
                >
                  <div className="animate-spin rounded-full w-10 h-10 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-xl text-gray-300">
                    Loading historical data...
                  </p>
                </div>
              ) : (
                <ReactApexChart
                  options={lineChartOptions}
                  series={lineChartData}
                  type="area"
                  height={350}
                />
              )}
            </div>
            <div className="flex flex-col h-[300px] w-[35%] ml-6 items-center justify-between font-semibold text-[15px] bg-red-100//">
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
                    onClick={() => {
                      setSelectedIndex(idx);
                      onSelectIndex(idx);
                    }}
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
                    className={`cursor-pointer ${
                      selectedIndex == idx ? "bg-gray-500/10" : ""
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockMarket;
