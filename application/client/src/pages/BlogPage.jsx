import axios from "axios";
import Header from "../components/layout/header/Header.jsx";
import { useEffect, useState, useContext } from "react";
import BlogCard from "../components/ui/card/BlogCard.jsx";
import categories from "../utils/CategoryList.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import CategorySlider from "../components/layout/slider/CategorySlider.jsx";
import { ThemeContext } from "../hooks/useTheme.jsx";
import NewBlog from "../components/ui/button/NewBlog.jsx";
import { List, LayoutGrid } from "lucide-react";
import SearchInput from "../components/ui/search/SearchInput.jsx";
import { DEVELOPMENT_BLOG_SERVER_BASE_URL } from "../utils/config.jsx";

const BlogPage = () => {
  const [blogs, setBlog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (query) => {
    console.log("Searching for:", query); // Debug log

    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.post(
        `${DEVELOPMENT_BLOG_SERVER_BASE_URL}/api/blog/search`,
        {
          query,
          page: 1,
          limit: 10,
          type: "all", // Search in title, content, and tags
        }
      );

      console.log("Search response:", response.data); // Debug log

      if (response.data.success) {
        setSearchResults(response.data.data.blogs);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const [viewMode, setViewMode] = useState("list");

  const { theme } = useContext(ThemeContext);
  const VITE_BASE_URL =
    import.meta.env.VITE_IP + ":" + import.meta.env.VITE_SERVER_PORT;

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchBlogByCategory({ category });
  };

  const fetchLatestBlog = async ({ page = 1 }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/blog/latest-blog",
        { page }
      );
      setBlog(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogByCategory = async ({
    page = 1,
    category = selectedCategory,
  }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/blog/category`,
        { page, category }
      );
      setBlog(data.blogs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestBlog({ page: 1 });
  }, []);

  useEffect(() => {
    document.title = "Blog Page";
  }, []);

  return (
    <div
      className={`blog-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary`}
    >
      <Header />

      <div className="body flex flex-col flex-1 w-full mt-30 px-6 sm:px-10 md:px-14 xl:px-40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6//">
          <div className="w-full md:w-2/3">
            <CategorySlider
              categories={categories}
              selectedCategory={selectedCategory}
              handleCategoryClick={handleCategoryClick}
            />
          </div>

          <div className="w-full md:w-1/3">
            <SearchInput
              onSearch={handleSearch}
              placeholder="Tìm kiếm tin tức ..."
            />
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

        <div
          className={` mt-4 w-full
            ${
              viewMode === "list"
                ? "flex flex-col items-center space-y-0"
                : "grid grid-cols-1 lg:grid-cols-2 gap-6"
            }
          `}
        >
          {searchLoading ? (
            <div className="mt-10 text-2xl font-bold h-screen">
              Searching...
            </div>
          ) : searchResults !== null ? (
            searchResults.length > 0 ? (
              searchResults.map((blog) => (
                <BlogCard
                  key={blog.blog_id}
                  blog={blog}
                  author={blog.author ? blog.author.personal_info : ""}
                  viewMode={viewMode}
                />
                // <h1>{blog.title}</h1>
              ))
            ) : (
              <div className="mt-10 text-2xl font-bold h-screen">
                No blogs found matching your search
              </div>
            )
          ) : // Show regular blog list when not searching

          blogs ? (
            blogs?.map((blog) => (
              <BlogCard
                key={blog.blog_id}
                blog={blog}
                author={blog.author ? blog.author.personal_info : ""}
                viewMode={viewMode}
              />
            ))
          ) : (
            <h1 className="mt-10 text-xl font-bold">
              Network error. No blogs are available
            </h1>
          )}
        </div>
      </div>

      <div className="fixed right-10 bottom-10">
        <NewBlog onClick={null} />
      </div>

      <div className="w-full mt-20">{blogs && <Footer />}</div>
    </div>
  );
};

export default BlogPage;
