import { useContext, useEffect, useState } from "react";

import { ThemeContext } from "../hooks/useTheme";
import Market from "../components/layout/market/Market";
import Stock from "../components/layout/stock/Stock";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import "../index.css";

const StockMarketPage = () => {
  useEffect(() => {
    document.title = "Stock Market in Real time";
  });

  const { theme, toggleTheme } = useContext(ThemeContext);
  const [selectedIndex, setSelectedIndex] = useState("VNINDEX");

  return (
    <div
      className={`stocks-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary`}
    >
      <Header />

      <div className="body flex flex-col flex-1 w-ful mt-5 mb-20">
        <div className="flex flex-col items-center justify-start flex-1 w-full">
          <div className="flex items-center justify-center w-full px-6 sm:px-10 md:px-14 xl:px-40">
            <Market onSelectIndex={setSelectedIndex} />
          </div>
          <div className="flex items-start justify-start w-full mt-10 px-6 sm:px-10 md:px-14 xl:px-40 bg-green-100//">
            <Stock indexId={selectedIndex} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StockMarketPage;
