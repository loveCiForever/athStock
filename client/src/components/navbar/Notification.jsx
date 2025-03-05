// .client/src/components/navbar/Notification.jsx

import BlackNotification from "../../assets/icon/lightmode/notification.svg";
import WhiteNotification from "../../assets/icon/darkmode/notification.svg";
import { useContext } from "react";
import { ThemeContext } from "../../App";

const Notification = () => {
  let { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      className={`notification p-2 rounded-full  active:scale-[.90] active:duration-75 transition-all bg-darkModeButtonColor ${
        theme == "light"
          ? " lg:hover:bg-gray-200 text-black"
          : "lg:hover:bg-black/40 text-white"
      }`}
      onClick={() => {
        console.log("Notification button clicked");
      }}
    >
      <img
        src={theme == "light" ? BlackNotification : WhiteNotification}
        className="w-5 h-5 lg:w-6 lg:h-6"
        alt="Notification"
      />
    </button>
  );
};

export default Notification;
