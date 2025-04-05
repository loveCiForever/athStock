// ./client/src/pages/BlogPage.jsx

import axios from "axios";
import NavBar from "../components/layout/navbar/NavBar.jsx";
import { useEffect, useState } from "react";
import BlogPost from "../components/ui/card/BlogCard.jsx";
import categories from "../components/layout/blog/CategoriesList.jsx";

const BlogsPage = ({ theme }) => {
  let [blogs, setBlog] = useState(null);
  let [selectedCategory, setSelectedCategory] = useState(null);
  let [loading, setLoading] = useState(true);

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
        VITE_BASE_URL + "/api/blog/latest-blog",
        { page }
      );
      setBlog(data.blogs);
      // console.log(data);
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
      setBlog(data.blogs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestBlog({ page: 1 });
    // console.log(blogs);
  }, []);

  useEffect(() => {
    document.title = "Blog Page";
  });

  return (
    <div
      className={`flex flex-col items-center min-w-full min-h-screen ${
        theme == "light" ? "bg-white" : "bg-darkModeBackgroundColor"
      }`}
    >
      <NavBar theme={theme} />
      <div className="flex justify-between w-full px-40 my-10">
        <div className="w-[65%] bg-red-300// h-full">
          {loading || blogs == null ? (
            <div>No blogs available</div>
          ) : blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogPost
                key={blog.blog_id}
                content={blog}
                author={blog.author.personal_info}
                theme={theme}
              />
            ))
          ) : (
            <div>No blogs available</div>
          )}
        </div>

        <div className="w-[30%] border-[1px] border-gray-300 rounded-xl h-fit">
          <h1 className="text-center text-xl font-semibold border-b-[1px] border-gray-300 p-4">
            Danh mục bài viết
          </h1>
          <div className="flex gap-3 w-full flex-wrap p-6">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`py-2 px-5 bg-black/80 text-white font-semibold border-none rounded-full hover:bg-black/50 ${
                  selectedCategory === category
                    ? "bg-orange-500/100 hover:bg-orange-500/100 "
                    : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
