// .client/src/components/navbar/WriteBlogButton.jsx

import { useContext } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeContext } from "../../App";

const WriteBlogButton = ({ theme }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <button
      className={`flex items-center justify-center active:scale-[.90] active:duration-75 transition-all shadow-xs rounded-full px-2 lg:px-5 py-[8px]  ${
        window.location.pathname === "/editor" ? "hidden" : ""
      } ${
        theme == "light"
          ? "bg-black lg:hover:bg-gray-200 text-white"
          : "lg:hover:bg-black/40 text-white bg-darkModeButtonColor"
      }`}
      onClick={() => {
        if (!user) {
          toast.error("You need to login first");
          navigate("/login");
        } else {
          navigate("/editor");
        }
      }}
    >
      <p className="font-semibold text-sm lg:text-base tracking-wider">Write</p>
    </button>
  );
};

export default WriteBlogButton;
