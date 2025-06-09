import { Search } from "lucide-react";
import { useContext, useState } from "react";
import { ThemeContext } from "../../../hooks/useTheme";
import { useDebounce } from "../../../hooks/useDebounce";

const SearchInput = ({ onSearch, placeholder = "Search blogs..." }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none transition-all
          ${
            theme === "dark-theme"
              ? "bg-zinc-800/50 focus:bg-zinc-800 border-zinc-700"
              : "bg-white border-gray-200 focus:bg-gray-50"
          }
          border focus:border-orange-500`}
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />
    </div>
  );
};

export default SearchInput;
