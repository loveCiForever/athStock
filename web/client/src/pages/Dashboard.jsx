import { useContext, useEffect, useState } from "react";
import NavBar from "../components/layout/navbar/NavBar";
import { ThemeContext } from "../App";
import { UserContext } from "../App";
import Market from "../components/layout/market/Market";

import StockCard from "../components/ui/cards/StockCard.jsx";
import MayBeYouCare from "../components/layout/may-be-you-care/MayBeYouCare.jsx";
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
          <div className="flex items-center justify-center w-full px-6 sm:px-10 md:px-14 xl:px-40">
            <Market />
          </div>
          <div className="flex items-center justify-center w-full mt-10 px-6 sm:px-10 md:px-14 xl:px-40 bg-green-100">
            {/* <MayBeYouCare /> */}
          </div>
        </div>
      </div>

      {/* <Footer theme={theme} /> */}
    </div>
  );
};

export default Dashboard;
