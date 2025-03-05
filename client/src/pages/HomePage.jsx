import { useContext, useEffect, useState } from "react";
import NavBar from "../components/navbar/NavBar";
import SideBar from "../components/sidebar/SideBar";

const HomePage = ({ theme }) => {
  useEffect(() => {
    document.title = "Home Page";
  });

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = (isOpen) => {
    setIsSideBarOpen(isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar && !sidebar.contains(event.target) && isSideBarOpen) {
        toggleSideBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideBarOpen]);

  return (
    <div
      className={`flex flex-col items-center min-w-full min-h-screen ${
        theme == "light" ? "bg-white" : "bg-darkModeBackgroundColor"
      }`}
    >
      <NavBar toggleSideBar={() => toggleSideBar(!isSideBarOpen)} />
      {/* {isSideBarOpen && <SideBar toggleSideBar={toggleSideBar} />} */}
    </div>
  );
};

export default HomePage;
