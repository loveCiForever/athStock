import { useContext, useEffect, useState } from "react";
import NavBar from "../components/layout/navbar/NavBar";
import { ThemeContext } from "../App";
import { UserContext } from "../App";
import Market from "../components/layout/market/Market";
import StockCard from "../components/ui/card/StockCard";
import MayBeYouCare from "../components/layout/may-be-you-care/MayBeYouCare.jsx";

const Dashboard = ({ theme }) => {
  useEffect(() => {
    document.title = "Dashboard";
  });

  return (
    <div
      className={`flex flex-col items-center min-w-full min-h-screen ${
        theme == "light" ? "bg-white" : "bg-darkModeBackgroundColor"
      }`}
    >
      <NavBar theme={theme} />

      <div className="flex items-center justify-center mt-5 bg-red-200//">
        <Market />
      </div>

      <div className="flex w-[1200px] bg-red-200// mt-10 gap-6">
        <div className="flex-col w-[800px]">
          <div className="flex items-start justify-start bg-red">
            <MayBeYouCare />
          </div>
        </div>
        <div className="w-[400px] border-[1px] border-gray-300 rounded-md h-fit">
          <h1 className="text-center text-lg font-semibold border-b-[1px] border-gray-300 p-2">
            Danh mục
          </h1>
          <div className="flex gap-3 w-full flex-wrap p-6"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
