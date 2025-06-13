// ./application/client/src/components/layout/user/UserPanel.jsx

import { LogOut, Sun, Moon, BookOpen, User } from "lucide-react";

import { Link } from "react-router-dom";
import { ThemeContext } from "../../../contexts/ThemeContext.jsx";
import { useContext } from "react";
import { toast } from "react-toastify";

import {
  UppercaseFirstLetterEachWord,
  TruncateString,
} from "../../../utils/formatString";

import { useAuthContext } from "../../../contexts/AuthContext.jsx";
import axios from "axios";

import { BLOG_SERVER_BASE_URL } from "../../../utils/config.jsx";

const UserPanel = ({ user }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout, getAccessToken } = useAuthContext();
  const authHeaders = user
    ? { headers: { Authorization: `Bearer ${getAccessToken()}` } }
    : {};

  const handleLogout = async () => {
    try {
      console.log(authHeaders);
      await axios.get(`${BLOG_SERVER_BASE_URL}/api/auth/logout`, authHeaders);
      toast.success("Sign out successful");
      logout();
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <div className="user-panel absolute right-0 md:right-0 top-15 z-50">
      <div
        className={`
          flex flex-col items-start justify-center 
          py-4 border-[1px] 
          ${
            theme === "dark-theme"
              ? "border-zinc-600"
              : "border-gray-200 bg-white"
          }
          rounded-lg shadow-xl 
          w-[250px] md:w-[250px]
          duration-200
          max-h-[90vh] overflow-y-auto
          mx-4 md:mx-0
        `}
      >
        <Link
          className="flex flex-col w-full text-left py-2 px-6"
          to={`/profile`}
        >
          <span className="text-base md:text-lg font-bold text-dark-grey mb-[5px] line-clamp-1">
            {user
              ? UppercaseFirstLetterEachWord(user.full_name)
              : "Full name error"}
          </span>
          <span className="text-sm md:text-md font-medium text-dark-grey hover:text-orange-600">
            @{user ? TruncateString(user.user_name, 20) : "User name error"}
          </span>
        </Link>

        <div
          className={`w-full h-[1px] ${
            theme === "dark-theme" ? "bg-zinc-600" : "bg-gray-200"
          } my-3`}
        />

        {/* Menu Items */}
        <div className="w-full">
          <Link
            className={`w-full flex items-center ${
              theme === "dark-theme" ? "hover:bg-black/20" : "hover:bg-gray-100"
            }`}
            to="/profile"
          >
            <div className="flex gap-3 px-6 py-3 w-full items-center text-sm md:text-base">
              <User size={20} />
              <span>View profile</span>
            </div>
          </Link>

          <Link
            className={`w-full flex items-center ${
              theme === "dark-theme" ? "hover:bg-black/20" : "hover:bg-gray-100"
            }`}
            to="/blog"
          >
            <div className="flex gap-3 px-6 py-3 w-full items-center text-sm md:text-base">
              <BookOpen size={20} />
              <span>My Blog</span>
            </div>
          </Link>
        </div>

        <div
          className={`w-full h-[1px] ${
            theme === "dark-theme" ? "bg-zinc-600" : "bg-gray-200"
          } my-3`}
        />

        {/* Theme Toggle & Logout */}
        <div className="w-full">
          <button
            className={`w-full flex items-center ${
              theme === "dark-theme" ? "hover:bg-black/20" : "hover:bg-gray-100"
            }`}
            onClick={toggleTheme}
          >
            <div className="flex gap-3 px-6 py-3 w-full items-center text-sm md:text-base">
              {theme === "dark-theme" ? <Sun size={20} /> : <Moon size={20} />}
              <span>
                Switch to {theme === "dark-theme" ? "light" : "dark"} mode
              </span>
            </div>
          </button>

          <button
            className={`w-full flex items-center ${
              theme === "dark-theme" ? "hover:bg-black/20" : "hover:bg-gray-100"
            }`}
            onClick={handleLogout}
          >
            <div className="flex gap-3 px-6 py-3 w-full items-center text-sm md:text-base">
              <LogOut size={20} />
              <span>Log out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
