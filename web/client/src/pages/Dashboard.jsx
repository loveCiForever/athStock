import { useContext, useEffect, useState } from "react";
import NavBar from "../components/layout/nav-bar/NavBar.jsx";
import { ThemeContext } from "../App";
import { UserContext } from "../App";
import Market from "../components/layout/market/Market";

import StockCard from "../components/ui/cards/StockCard.jsx";
import MayBeYouCare from "../components/layout/stock/MayBeYouCare.jsx";
import Footer from "../components/layout/footer/Footer.jsx";

const Dashboard = ({ theme }) => {
  useEffect(() => {
    document.title = "Dashboard";
  });

  return (
    <div
      className={`blogs-page 
          flex flex-col items-center min-h-screen w-full 
          ${theme == "light" ? "bg-white" : "bg-black/90"}
        `}
    >
      <NavBar theme={theme} />

      <div className="body flex flex-col flex-1 w-full md:mt-[80px] xl:mt-[100px]">
        <div className="flex flex-col items-center justify-start flex-1 w-full">
          <div className="flex items-center justify-center w-full">
            <Market />
          </div>
          <div className="flex items-start justify-start w-[1300px] gap-10 my-10 bg-green-100//">
            <MayBeYouCare />
            <div className="flex flex-1 rounded-xl bg-white border-[1px] mt-10 border-gray-200 h-[400px]">
              <h1 className="w-full text-center text-xl font-bold mt-4">
                Coming Soon
              </h1>
            </div>
          </div>
        </div>
      </div>
 
      <Footer theme={theme} />
    </div>
  );
};

export default Dashboard;
