import { useNavigate } from "react-router-dom";

import HomeIcon from "../../assets/icon/homeIcon.png";
import MarketTrendIcon from "../../assets/icon/marketTrendIcon.png";
import CommunityIcon from "../../assets/icon/communityIcon.png";
import UserGuideIcon from "../../assets/icon/userGuideIcon.png";
import newsIcon from "../../assets/icon/newsIcon.png";

import Branding from "../branding/Branding.jsx";
import Hamburger from "../navbar/Hamburger.jsx";

const SideBar = ({ toggleSideBar }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    toggleSideBar(false);
  };

  return (
    <div className="sidebar fixed inset-0 h-screen flex transition ease-in-out bg-red-200 w-60">
      <nav className="bg-white shadow-md shadow-gray-400 w-60">
        <div className="flex h-[65px] sticky items-center justify-start">
          <div className="ml-4 bg-red-00 ">
            <Hamburger toggleSideBar={toggleSideBar} />
          </div>

          <div className="ml-5 bg-red-00 ">
            <Branding />
          </div>
        </div>
        <div className="flex flex-col text-[13px] tracking-wider pr-[30px] mb-[20px]">
          <button
            className={`flex items-center mt-2 py-2 pl-7 text-primary-content font-medium hover:bg-orange-100 rounded-r-full ${
              window.location.pathname === "/"
                ? "bg-orange-300 hover:bg-orange-300"
                : "bg-orange-000"
            }`}
            onClick={() => handleNavigation("/")}
          >
            <img src={HomeIcon} className="w-5" alt="Home" />
            <span className="pl-[14px] pb-[1px]">Home</span>
          </button>
          <button
            className={`flex items-center mt-2 py-2 pl-7 text-primary-content font-medium hover:bg-orange-100 rounded-r-full ${
              window.location.pathname === "/markettrend"
                ? "bg-orange-300 hover:bg-orange-300"
                : "bg-orange-000"
            }`}
            onClick={() => handleNavigation("/markettrend")}
          >
            <img src={MarketTrendIcon} className="w-5" alt="Market" />
            <span className="pl-[14px] pb-[1px]">Market</span>
          </button>
          <button
            className={`flex items-center mt-2 py-2 pl-7 text-primary-content font-medium hover:bg-orange-100 rounded-r-full ${
              window.location.pathname === "/community"
                ? "bg-orange-300 hover:bg-orange-300"
                : "bg-orange-000"
            }`}
            onClick={() => handleNavigation("/community")}
          >
            <img src={CommunityIcon} className="w-5" alt="Community" />
            <span className="pl-[14px] pb-[1px]">Community</span>
          </button>
          <button
            className={`flex items-center mt-2 py-2 pl-7 text-primary-content font-medium hover:bg-orange-100 rounded-r-full ${
              window.location.pathname === "/userguide"
                ? "bg-orange-300 hover:bg-orange-300"
                : "bg-orange-000"
            }`}
            onClick={() => handleNavigation("/userguide")}
          >
            <img src={UserGuideIcon} className="w-5" alt="User Guide" />
            <span className="pl-[14px] pb-[1px]">User Guide</span>
          </button>
          <button
            className={`flex items-center mt-2 py-2 pl-7 text-primary-content font-medium hover:bg-orange-100 rounded-r-full ${
              window.location.pathname === "/news"
                ? "bg-orange-300 hover:bg-orange-300"
                : "bg-orange-000"
            }`}
            onClick={() => handleNavigation("/financialnews")}
          >
            <img src={newsIcon} className="w-5" alt="Financial News" />
            <span className="pl-[14px] pb-[1px]">Financial News</span>
          </button>

          {/* <TheStrongestPerformingCards /> */}
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
