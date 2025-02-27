// .client/src/components/navbar/Notification.jsx

import EmailUnRead from "../../assets/icon/unreadEmailIcon.png";

const Notification = () => {
  return (
    <button
      className="notification p-2 hover:rounded-full lg:hover:bg-gray-200  active:scale-[.90] active:duration-75 transition-all"
      onClick={() => {
        console.log("Notification button clicked");
      }}
    >
      <img
        src={EmailUnRead}
        className="w-4 h-4 lg:w-6 lg:h-6"
        alt="Notification"
      />
    </button>
  );
};

export default Notification;
