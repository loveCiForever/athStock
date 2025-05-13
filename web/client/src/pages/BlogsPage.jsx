// athStock/client/src/pages/BlogPage.jsx

import axios from "axios";
import NavBar from "../components/layout/nav-bar/NavBar.jsx";
import { useEffect, useState } from "react";
import BlogCard from "../components/ui/cards/BlogCard.jsx";
import categories from "../utils/CategoriesList.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import ErrorImage from "../assets/images/error404.png";
import CategorySlider from "../components/ui/sliders/CategorySlider.jsx";
import Loader from "../components/ui/animations/Loader.jsx";
import { OrbitProgress } from "react-loading-indicators";

const BlogsPage = ({ theme }) => {
  let [blogs, setBlog] = useState(null);
  let [selectedCategory, setSelectedCategory] = useState(null);
  let [loading, setLoading] = useState(true);

  const VITE_BASE_URL = import.meta.env.VITE_REMOTE_API_SERVER;

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchBlogByCategory({ category });
  };

  const fetchLatestBlog = async ({ page = 1 }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        VITE_BASE_URL + "/api/blog/latest-blog",
        { page }
      );
      setBlog(data.data);
      // console.log(data.data);
    } catch (error) {
      console.error(error);
      setLoading(true);
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
      const { data } = await axios.post(VITE_BASE_URL + "/api/blog/category/", {
        page,
        category,
      });
      // console.log(data);
      setBlog(data.blogs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestBlog({ page: 1 });
  }, []);

  useEffect(() => {
    document.title = "Blog Page";
  });

  return (
    <div
      className={`blogs-page 
          flex flex-col items-center min-h-screen w-full 
          ${theme == "light" ? "bg-white" : "bg-black/90"}
        `}
    >
      <NavBar theme={theme} />

      <div className="body flex flex-col flex-1 w-full md:mt-[80px] xl:mt-[100px]">
        {loading ? (
          <div className="flex items-center justify-center">
            <OrbitProgress variant="split-disc" color="orange" size="large" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start flex-1 w-full px-6 sm:px-10 md:px-14 xl:px-40">
            {blogs && (
              <CategorySlider
                categories={categories}
                selectedCategory={selectedCategory}
                handleCategoryClick={handleCategoryClick}
              />
            )}

            <div className="flex flex-col flex-1 w-full blog-cards">
              {blogs && blogs.length > 0 ? (
                blogs.map((blog) => (
                  <BlogCard
                    key={blog.blog_id}
                    content={blog}
                    author={blog.author ? blog.author.personal_info : ""}
                    theme={theme}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center flex-1 blogs-null md:px-32">
                  <div className="flex flex-col items-center justify-center w-full text-base font-normal tracking-widest text-center md:text-xl lg:text-2xl">
                    <img
                      src={ErrorImage}
                      alt="error image"
                      className="w-1/3 lg:w-1/4"
                    />
                    <h1 className="">No blog available, reload the website</h1>
                    <h1 className="mt-4">
                      If you believe this is a server error, report to our team
                      through this{" "}
                      <a href="#" className="font-bold hover:text-blue-500">
                        Bug Submission Form
                      </a>
                    </h1>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full mt-20">{blogs && <Footer />}</div>
    </div>
  );
};

export default BlogsPage;
