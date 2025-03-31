import { useContext, useEffect, useState } from "react";
import NavBar from "../components/layout/navbar/NavBar";
import { ThemeContext } from "../App";
import { UserContext } from "../App";
import Market from "../components/layout/market/Market";

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

      <div className="flex items-center justify-center w-auto mt-5">
        <Market />
      </div>
    </div>
  );
};

export default Dashboard;
