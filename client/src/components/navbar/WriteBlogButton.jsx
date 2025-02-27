// .client/src/components/navbar/WriteBlogButton.jsx

import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const WriteBlogButton = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <button
      className={`flex items-center justify-center active:scale-[.90] active:duration-75 transition-all shadow-xs rounded-full px-2 lg:px-4 py-2 lg:hover:bg-gray-200 ${
        window.location.pathname === "/editor" ? "hidden" : ""
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
