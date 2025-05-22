// athStock/client/src/pages/BlogPage.jsx

import axios from "axios";
import Header from "../components/layout/header/Header.jsx";
import { useEffect, useState, useContext } from "react";
import BlogCard from "../components/ui/card/BlogCard.jsx";
import categories from "../utils/CategoryList.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import ErrorImage from "../assets/images/error404.png";
import CategorySlider from "../components/layout/slider/CategorySlider.jsx";
import { ThemeContext } from "../hooks/useTheme.jsx";

const BlogPage = () => {
  let [blogs, setBlog] = useState(null);
  let [selectedCategory, setSelectedCategory] = useState(null);
  let [loading, setLoading] = useState(true);

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
      console.log(data);
      setBlog(data.data);
    } catch (error) {
      console.error(error);
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  // const fetchBlogByCategory = async ({
  //   page = 1,
  //   category = selectedCategory,
  // }) => {
  //   setLoading(true);
  //   try {
  //     const { data } = await axios.post(VITE_BASE_URL + "/api/blog/category/", {
  //       page,
  //       category,
  //     });
  //     // console.log(data);
  //     setBlog(data.blogs);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchLatestBlog({ page: 1 });
  }, []);

  useEffect(() => {
    document.title = "Blog Page";
  });

  return (
    <div
      className={`blog-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary`}
    >
      <Header />

      <div className="body flex flex-col flex-1 w-full mt-4">
        <div className="flex flex-col items-center justify-start flex-1 w-full px-6 sm:px-10 md:px-14 xl:px-40">
          <CategorySlider
            categories={categories}
            selectedCategory={selectedCategory}
            handleCategoryClick={handleCategoryClick}
          />
          <div className="flex flex-col flex-1 mt-4 w-full blog-cards">
            {blogs && blogs.length > 0
              ? blogs.map((blog) => (
                  <BlogCard
                    key={blog.blog_id}
                    content={blog}
                    author={blog.author ? blog.author.personal_info : ""}
                    theme={theme}
                  />
                ))
              : ""}
          </div>
        </div>
      </div>

      <div className="w-full mt-20">{blogs && <Footer />}</div>
    </div>
  );
};

export default BlogPage;
