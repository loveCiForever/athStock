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

const BlogPage = () => {
  const [blogs, setBlog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. State cho view mode
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'

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

      <div className="body flex flex-col flex-1 w-full mt-4 px-6 sm:px-10 md:px-14 xl:px-40">
        <CategorySlider
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
        />

        <div className="mt-4">
          {viewMode === "list" ? (
            <button
              onClick={() => {
                setViewMode("grid");
              }}
            >
              <LayoutGrid />
            </button>
          ) : (
            <button
              onClick={() => {
                setViewMode("list");
              }}
            >
              <List />
            </button>
          )}
        </div>

        <div
          className={` mt-0 w-full
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

      <div className="fixed right-4 bottom-4">
        <NewBlog onClick={null} />
      </div>

      <div className="w-full mt-20">{blogs && <Footer />}</div>
    </div>
  );
};

export default BlogPage;
