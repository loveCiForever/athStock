import { useContext, useEffect, useState } from "react";
import NavBar from "../components/layout/navbar/NavBar";
import { ThemeContext } from "../App";
import { UserContext } from "../App";

const HomePage = () => {
  useEffect(() => {
    document.title = "Home Page";
  });

  const { theme } = useContext(ThemeContext);
  const { userAuth } = useContext(UserContext);

  return (
    <div
      className={`flex flex-col items-center min-h-screen ${
        theme == "light" ? "bg-white" : "bg-black/90"
      }`}
    >
      <NavBar theme={theme} />
    </div>
  );
};

export default HomePage;
