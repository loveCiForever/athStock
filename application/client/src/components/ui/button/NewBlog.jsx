import React, { useContext } from "react";
import { Plus } from "lucide-react";
import { ThemeContext } from "../../../hooks/useTheme.jsx";
import { useNavigate } from "react-router-dom";

const NewBlog = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/blog/new")}
      className={`
        new-blog-button flex items-center gap-2 px-4 py-4 rounded-full shadow-md
        cursor-pointer transition-colors duration-200 
        ${
          theme === "dark-theme"
            ? "bg-gray-100 text-zinc-800 hover:bg-gray-300"
            : "bg-orange-500 text-white hover:bg-gray-200 hover:text-orange-800"
        }
        }
      `}
    >
      <Plus
        className="w-5 h-5 transform transition-transform duration-1000
                   group-hover:rotate-360"
      />
      <span
        className="text-sm font-medium transition-all duration-500
                   hidden group-hover:block"
      >
        New Blog
      </span>
    </button>
  );
};

export default NewBlog;
