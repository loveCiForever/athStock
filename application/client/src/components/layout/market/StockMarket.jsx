import { useEffect, useState, useMemo, useContext, useRef } from "react";
import axios from "axios";
import { ChevronsUpDown, ChevronsDownUp } from "lucide-react";
import { ThemeContext } from "../../../hooks/useTheme";
import MarketCard from "../../ui/card/MarketCard";
import { formatDateViEn } from "../../../utils/formatDate";
import ReactApexChart from "react-apexcharts";
import "../../../index.css";
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

  const parseTradingDate = (str) => {
    const [day, month, year] = str.split("/");
    return new Date(+year, +month - 1, +day).getTime();
  };

  const [isFetching, setIsFetching] = useState(false);
  const [dataMap, setDataMap] = useState({
    VNINDEX: [],
    VN30: [],
    HNXINDEX: [],
    HNX30: [],
  });

  const [selectedIndex, setSelectedIndex] = useState("");
  const handleSelectedIndex = (index) => {
    if (index === selectedIndex) {
      setSelectedIndex("");
    } else {
      setSelectedIndex(index);
    }

    // console.log(index);
  };

  const hasFetchedData = useRef(false);

  const dayIndex = now.getDay();
  const isWeekend = dayIndex === 0 || dayIndex === 6;

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    // const shouldFetchDataOneTime = currentHour >= 15 || currentHour < 9;

    // if (!shouldFetchDataOneTime || hasFetchedData.current) return;

    // hasFetchedData.current = true;

    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - 30);

    const fetchCurrentIndex = async () => {
      setIsFetching(true);

      const indexes = ["VNINDEX", "HNXINDEX", "VN30", "HNX30"];
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for (const idx of indexes) {
        const payload = {
          indexId: idx,
          fromDate: formatDateViEn(from),
          toDate: formatDateViEn(to),
          pageIndex: 1,
          pageSize: 10,
          ascending: false,
        };

        console.log(payload);

        try {
          const res = await axios.post(
            "http://localhost:3000/ssi/DailyIndex",
            payload
          );
          console.log(res);

          if (res.data.status !== 429 && res.data.data?.[0]) {
            const item = res.data.data;
            setDataMap((prevDataMap) => ({
              ...prevDataMap,
              [idx]: item,
            }));
          }
        } catch (err) {
          console.error(`Error fetching ${idx}:`, err);
        }

        await sleep(3000);
      }

      setIsFetching(false);
    };

    fetchCurrentIndex();
  }, []);

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
      data: (dataMap[index] || []).map((item) => ({
        x: parseTradingDate(item.TradingDate),
        y: parseFloat(item.RatioChange),
      })),
    }));
  }, [dataMap]);

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
        <div className="mt-4 pr-4 bg-white// rounded-lg border-[1px] border-gray-500 shadow-xl/">
          <div className="flex w-full items-center justify-between">
            <div className="w-[60%] py-10 bg-red-100// px-5 //">
              {/* <h1 className="w-full text-center text-xl font-bold mb-5">
                {selectedIndex
                  ? `Candlestick Chart for ${selectedIndex}`
                  : "Close price in 30 days"}
              </h1> */}
              <ReactApexChart
                options={lineChartOptions}
                series={lineChartData}
                type="area"
                height={350}
              />
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
