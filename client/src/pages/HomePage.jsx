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

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  // useEffect(() => {
  //   console.log(userAuth);
  // });

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
