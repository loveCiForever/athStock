// src/components/layout/stock/Stock.jsx
import React, { useEffect, useState, useMemo, useRef, useContext } from "react";
import axios from "axios";
import { BlinkBlur } from "react-loading-indicators";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ThemeContext } from "../../../hooks/useTheme";

const indexMap = {
  VNINDEX: "vn100",
  HNXINDEX: "hnx100",
  VN30: "vn30",
  HNX30: "hnx30",
};

const Stock = ({ indexId }) => {
  const [listData, setListData] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const { theme } = useContext(ThemeContext);
  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const formatPriceWithSpaces = (value) => {
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  const lastReqTimeRef = useRef(0);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    if (!indexId) return;

    const now = new Date();
    const hour = now.getHours();

    const code = indexMap[indexId] || indexId.toLowerCase();
    const endpoint = `http://localhost:3000/ssi/${code}-intraday`;

    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - 30);

    // Hàm fetch data
    const fetchList = async () => {
      setIsLoadingList(true);
      try {
        const res = await axios.post(endpoint, {
          fromDate: formatDate(from),
          toDate: formatDate(to),
          pageIndex: 1,
          pageSize: 100,
          ascending: false,
        });
        setListData(res.data.data || []);
      } catch (err) {
        console.error(`Fetch ${endpoint} failed:`, err);
        setListData([]);
      } finally {
        setIsLoadingList(false);
      }
    };

    if (hour >= 15 || hour < 9) {
      fetchList();

      return;
    }

    fetchList();
    const intervalId = setInterval(fetchList, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [indexId]);

  const fetchStockIntraday = async (symbol) => {
    const now = Date.now();
    const wait = 1000 - (now - lastReqTimeRef.current);
    if (wait > 0) {
      await sleep(wait);
    }

    lastReqTimeRef.current = Date.now();

    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - 30);

    setIsLoadingModal(true);
    try {
      const res = await axios.post("http://localhost:3000/ssi/IntradayOhlc", {
        symbol,
        fromDate: formatDate(from),
        toDate: formatDate(to),
        pageIndex: 1,
        pageSize: 1000,
        ascending: false,
      });
      console.log(res);
      const arr = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data?.data || [];
      setModalData({ symbol, data: arr });
      setShowModal(true);
    } catch (err) {
      console.error(`Fetch IntradayOhlc for ${symbol} failed:`, err);
    } finally {
      setIsLoadingModal(false);
    }
  };

  const closeModal = () => setShowModal(false);

  // Formatter cho XAxis
  const monthFmt = useMemo(
    () => new Intl.DateTimeFormat("en-US", { month: "short" }),
    []
  );
  const formatDayMonth = (dateStr) => {
    const [d, m, y] = dateStr.split("/").map(Number);
    return `${d} ${monthFmt.format(new Date(y, m - 1, d))}`;
  };

  // Tính ticks trên chart
  const ticks = useMemo(() => {
    const arr = modalData?.data || [];
    return arr.filter((_, i) => i % 5 === 0).map((d) => d.TradingDate);
  }, [modalData]);

  if (isLoadingList) {
    return (
      <div className="flex flex-col w-full items-center justify-center mt-10">
        <BlinkBlur color="#fdff12" size="large" />
        <h1 className="mt-5 text-2xl font-bold animate-pulse">
          Loading {indexId} …
        </h1>
      </div>
    );
  }

  // console.log(modalData);

  return (
    <div className={`${theme === "dark-theme" ? "text-white" : "text-black"}`}>
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg shadow-lg w-full max-w-3xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalData.symbol} — 30-Day OHLC
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500// hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
            </div>
            {isLoadingModal ? (
              <div className="flex justify-center">
                <BlinkBlur color="#86ff4d" size="small" />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}

      {/* <div className="w-full">
        <div className="grid grid-cols-12 text-start items-center gap-4 mb-2 p-2 bg-gray-00// font-bold text-gray-700//">
          <div>Symbol</div>
          <div className="col-span-5 text-start">Company</div>
          <div>Open</div>
          <div>High</div>
          <div>Low</div>
          <div>Close</div>
          <div>Value</div>
          <div>Predicted</div>
        </div>

        {listData.map((row) => {
          if (!Array.isArray(row.data) || row.data.length === 0) return null;
          const ohlc = row.data[0];
          return (
            <div
              key={row.symbol}
              onClick={() => fetchStockIntraday(row.symbol)}
              className="cursor-pointer grid grid-cols-12 items-center gap-4 mb-4 p-2 bg-white// rounded hover:bg-gray-100 min-w-0"
            >
              <div>
                <span className="text-white// tracking-wide bg-orange-400// px-3 py-1 font-bold rounded font-mono">
                  {row.symbol}
                </span>
              </div>

              <div className="col-span-5 min-w-0">
                <p className="truncate font-semibold" title={row.stockEnName}>
                  {row.stockEnName}
                </p>
              </div>

              <div className="text-blue-500">
                {formatPriceWithSpaces(ohlc.Open)}
              </div>
              <div className="text-green-600">
                {formatPriceWithSpaces(ohlc.High)}
              </div>
              <div className="text-red-600">
                {formatPriceWithSpaces(ohlc.Low)}
              </div>
              <div className="text-yellow-500">
                {formatPriceWithSpaces(ohlc.Close)}
              </div>
              <div className="text-gray-500">
                {formatPriceWithSpaces(ohlc.Value)}
              </div>

              <div className="text-purple-600 font-semibold">
                {parseFloat(ohlc.Close) - 1000}
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default Stock;
