import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../hooks/useTheme";
import Header from "../components/layout/header/Header";
import BlogCard from "../components/ui/card/BlogCard";
import { DEVELOPMENT_BLOG_SERVER_BASE_URL } from "../utils/config";
import { List, LayoutGrid, Tag } from "lucide-react";
import { Tag as TagIcon } from "lucide-react";
import SearchInput from "../components/ui/search/SearchInput";
import NewBlog from "../components/ui/button/NewBlog";
import Footer from "../components/layout/footer/Footer";
const TaggedBlogsPage = () => {
  const { tag } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    try {
      const { data } = await axios.post(
        `${DEVELOPMENT_BLOG_SERVER_BASE_URL}/api/blog/search`,
        { query, page: 1, limit: 10 }
      );
      setSearchResults(data.data.blogs);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const fetchBlogsByTag = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${DEVELOPMENT_BLOG_SERVER_BASE_URL}/api/blog/search-by-tag`,
          { tag, page: 1, limit: 10 }
        );
        console.log(response);
        setBlogs(response.data.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs by tag:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsByTag();
  }, [tag]);

  return (
    <div
      className={`tagged-blogs-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary`}
    >
      <Header />

      <main className="body flex flex-col flex-1 w-full mt-30 px-6 sm:px-10 md:px-14 xl:px-40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6//">
          <h1 className="text-2xl font-bold  flex items-center gap-2 w-full">
            <TagIcon size={20} strokeWidth={2} />
            <span className=" text-black-500">{decodeURIComponent(tag)}</span>
          </h1>

          <div className="flex w-full items-center justify-end gap-4">
            <div className="w-full md:w-2/3">
              <SearchInput onSearch={handleSearch} />
            </div>
            <div className="flex items-center p-2 justify-center rounded-lg hover:bg-gray-200">
              {viewMode === "list" ? (
                <button
                  onClick={() => {
                    setViewMode("grid");
                  }}
                  className="text-orange-500"
                >
                  <LayoutGrid strokeWidth="2px" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setViewMode("list");
                  }}
                  className="text-orange-500"
                >
                  <List strokeWidth="2px" />
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
          </div>
        ) : (
          <div>
            <div
              className={` mt-4 w-full
            ${
              viewMode === "list"
                ? "flex flex-col items-center space-y-0"
                : "grid grid-cols-1 lg:grid-cols-2 gap-6"
            }
          `}
            >
              {loading ? (
                <div className="mt-10 text-2xl font-bold">Loading...</div>
              ) : blogs === null ? (
                <div className="mt-10 text-2xl font-bold">
                  Network error. No blog available
                </div>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <BlogCard
                    key={blog.blog_id}
                    blog={blog}
                    author={blog.author ? blog.author.personal_info : ""}
                    viewMode={viewMode}
                  />
                ))
              ) : (
                <div className="mt-10 text-2xl font-bold">
                  No blog for this category
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="flex flex-col w-full items-center justify-center gap-2">
            <p className="text-center text-gray-500">
              No posts found with tag: {decodeURIComponent(tag)}
            </p>

            <button
              className={`px-6 py-2 cursor-pointer hover:underline ${
                theme === "dark-theme"
                  ? "hover:text-orange-500"
                  : "hover:text-orange-500"
              }`}
              onClick={() => navigate("/blog")}
            >
              Return to Blog Page
            </button>
          </div>
        )}
      </main>
      <div className="fixed right-10 bottom-10">
        <NewBlog onClick={null} />
      </div>
      <div className="w-full mt-20">{blogs && <Footer />}</div>
    </div>
  );
};

export default TaggedBlogsPage;
