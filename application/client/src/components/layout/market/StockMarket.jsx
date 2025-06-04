import { useEffect, useState, useMemo, useContext, useRef } from "react";
import axios from "axios";
import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";
import { ThemeContext } from "../../../hooks/useTheme";
import MarketCard from "../../ui/card/MarketCard";
import { formatDateViEn } from "../../../utils/formatDate";
import ReactApexChart from "react-apexcharts";
import "../../../index.css";
import useSocket from "../../../hooks/useSocket";

const StockMarket = ({ onSelectIndex }) => {
  const { marketData, isConnected, switchChannel } = useSocket();
  const [isExpanded, setIsExpanded] = useState(false);
  const [now, setNow] = useState(new Date());
  const { theme } = useContext(ThemeContext);
  const [selectedIndex, setSelectedIndex] = useState("");
  const dayIndex = now.getDay();
  const isWeekend = dayIndex === 0 || dayIndex === 6;
  const [isLoading, setIsLoading] = useState(false);
  const [dataMap, setDataMap] = useState({
    VNINDEX: [],
    VN30: [],
    HNXINDEX: [],
    HNX30: [],
  });

  const parseTradingDate = (str) => {
    const [day, month, year] = str.split("/");
    return new Date(+year, +month - 1, +day).getTime();
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // console.log(marketData);
    if (marketData && marketData.IndexId) {
      let indexKey = marketData.IndexId.toUpperCase();
      const indexMapping = {
        HNXINDEX: "HNXINDEX",
        HNX30: "HNX30",
        VNINDEX: "VNINDEX",
        VN30: "VN30",
      };
      indexKey = indexMapping[indexKey] || indexKey;

      setDataMap((prevDataMap) => {
        const newDataMap = {
          ...prevDataMap,
          [indexKey]: [marketData, ...(prevDataMap[indexKey] || [])],
        };
        return newDataMap;
      });
    }
  }, [marketData]);

  const [historicalData, setHistoricalData] = useState({});
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

  const lineChartData = useMemo(() => {
    const indexes = ["VNINDEX", "VN30", "HNXINDEX", "HNX30"];
    return indexes.map((index) => ({
      name: index,
      data: isExpanded
        ? (historicalData[index]?.data || []).map((item) => ({
            x: parseTradingDate(item.TradingDate),
            y: parseFloat(item.RatioChange),
          }))
        : [],
    }));
  }, [historicalData, isExpanded]);

  const [isFetching, setIsFetching] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    let intervalId;

    const fetchHistoricalData = async () => {
      if (!isExpanded || isFetching) return;

      try {
        setIsFetching(true);
        setIsLoading(true);
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const fromDate = formatDateViEn(thirtyDaysAgo);
        const toDate = formatDateViEn(today);

        const indices = ["VNINDEX", "VN30", "HNXINDEX", "HNX30"];

        const responses = await Promise.all(
          indices.map((indexId) =>
            axios.post("http://localhost:3000/ssi/DailyIndex", {
              indexId,
              fromDate,
              toDate,
              pageIndex: 1,
              pageSize: 1000,
              ascending: false,
            })
          )
        );
        // console.log(responses);
        const historicalDataMap = {};
        responses.forEach((response, index) => {
          if (response.data?.data) {
            historicalDataMap[indices[index]] = {
              data: response.data.data,
            };
          }
        });

        await sleep(2000);
        if (Object.keys(historicalDataMap).length === indices.length) {
          setHistoricalData(historicalDataMap);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
        setIsLoading(false);
      } finally {
        setIsFetching(false);
      }
    };

    if (isExpanded) {
      fetchHistoricalData();
      intervalId = setInterval(fetchHistoricalData, 20000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isExpanded]);

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
            <h1>Expand</h1>
          </div>
          <div className="flex gap-2">
            {now.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            {isWeekend && <h1 className="text-gray-500">(ĐÓNG CỬA)</h1>}
          </div>
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
                  TotalVol={first.AllQty}
                  TotalVal={first.AllValue}
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
                    // onClick={() => handleSelectedIndex(idx)}
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
