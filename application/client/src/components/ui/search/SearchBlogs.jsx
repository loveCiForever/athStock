import { useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";
import axios from "axios";
import { DEVELOPMENT_BLOG_SERVER_BASE_URL } from "../../../utils/config";

const SearchBlogs = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(async (query) => {
    if (!query.trim()) {
      onSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${DEVELOPMENT_BLOG_SERVER_BASE_URL}/api/blog/search`,
        { query, page: 1, limit: 10 }
      );
      onSearchResults(data.data.blogs);
    } catch (error) {
      console.error("Search failed:", error);
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search blogs by title or tags..."
          className="w-full px-8 py-2 pl-10 border border-gray-300 rounded-3xl focus:outline-none focus:border-orange-500"
        />
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-orange-500" />
        </div>
      )}
    </div>
  );
};

export default SearchBlogs;
