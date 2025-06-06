import { LogOut, Sun, Moon, BookOpen, User } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../hooks/useTheme";
import { useContext } from "react";
import {
  UppercaseFirstLetterEachWord,
  TruncateString,
} from "../../../utils/formatString";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";
import axios from "axios";

import { DEVELOPMENT_BLOG_SERVER_BASE_URL } from "../../../utils/config.jsx";
const UserPanel = ({ user }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const { logout, getAccessToken } = useAuthContext();
  const authHeaders = user
    ? { headers: { Authorization: `Bearer ${getAccessToken()}` } }
    : {};

  const handleLogout = async () => {
    try {
      console.log(authHeaders);
      await axios.get(
        `${DEVELOPMENT_BLOG_SERVER_BASE_URL}/api/auth/logout`,
        authHeaders
      );
      toast.success("Sign out successful");
      logout();
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <div className="user-panel absolute right-40 top-20 z-50">
      <div
        className={`flex flex-col items-start justify-center py-4 border-[1px] ${
          theme === "dark-theme"
            ? "border-zinc-600 "
            : "border-gray-200 bg-white"
        } rounded-lg shadow-xl w-[250px] duration-200 `}
      >
        <Link
          className="flex flex-col w-full text-left py-2 pl-6"
          to={`/profile`}
        >
          <span className="text-lg font-bold text-dark-grey mb-[5px] line-clamp-1">
            {user
              ? UppercaseFirstLetterEachWord(user.full_name)
              : "Full name error"}
          </span>
          <span className="text-md font-medium text-dark-grey hover:text-blue-600">
            @{user ? TruncateString(user.user_name, 20) : "User name error"}
          </span>
        </Link>

        <div
          className={`w-full h-[1.5px] ${
            theme === "dark-theme" ? "bg-zinc-600" : "bg-gray-200"
          } my-4`}
        />

        <Link
          className={`w-full ${
            theme === `dark-theme` ? "hover:bg-black/20" : "hover:bg-gray-100"
          }`}
          to={"/profile"}
        >
          <div className="flex gap-3 pl-6 py-2 w-full items-center justify-start text-md">
            <User size={23} />
            <span>View profile</span>
          </div>
        </Link>

        <Link
          className={`w-full ${
            theme === `dark-theme` ? "hover:bg-black/20" : "hover:bg-gray-100"
          }`}
        >
          <div className="flex gap-3 pl-6 py-2 w-full items-center justify-start text-md">
            <BookOpen size={23} />
            <p>My Blog</p>
          </div>
        </Link>

        <div
          className={`w-full h-[1.5px] ${
            theme === "dark-theme" ? "bg-zinc-600" : "bg-gray-200"
          } my-4`}
        />

        <button
          className={`w-full ${
            theme === `dark-theme` ? "hover:bg-black/20" : "hover:bg-gray-100"
          }`}
        >
          <div
            className="flex gap-3 pl-6 py-2 w-full items-center justify-start text-md"
            onClick={toggleTheme}
          >
            {theme === "dark-theme" ? <Sun size={23} /> : <Moon size={23} />}
            Switch to {theme === "dark-theme" ? "light" : "dark"} mode
          </div>
        </button>

        <div
          className={`w-full ${
            theme === `dark-theme` ? "hover:bg-black/20" : "hover:bg-gray-100"
          }`}
        >
          <button
            className="flex gap-3 pl-6 py-2 w-full items-center justify-start text-md"
            onClick={handleLogout}
          >
            <LogOut size={23} />
            <p>Log out</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
