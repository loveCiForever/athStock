import { useContext, useEffect, useState } from "react";
import NavBar from "../components/navbar/NavBar";

const HomePage = ({ theme }) => {
  useEffect(() => {
    document.title = "Home Page";
  });

  return (
    <div
      className={`flex flex-col items-center min-w-full min-h-screen ${
        theme == "light" ? "bg-white" : "bg-darkModeBackgroundColor"
      }`}
    >
      <NavBar theme={theme} />
    </div>
  );
};

export default HomePage;
