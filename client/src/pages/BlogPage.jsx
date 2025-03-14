// ./client/src/pages/BlogPage.jsx
import axios from "axios";
import NavBar from "../components/navbar/NavBar";
import { useEffect, useState } from "react";
import BlogPost from "../components/blog/BlogPost";
import Loader from "../components/common/Loader";
import { data } from "react-router-dom";

const BlogPage = ({ theme }) => {
  useEffect(() => {
    document.title = "Blog Page";
  });

  let [blogs, setBlog] = useState(null);
  let [trendingBlog, setTrendingBlog] = useState(null);
  let [pageState, setPageState] = useState("blog");
  let [loading, setLoading] = useState(true);
  const VITE_BASE_URL =
    import.meta.env.VITE_IP + ":" + import.meta.env.VITE_SERVER_PORT;

  let categories = [
    "Tin tức trong nước",
    "Tin tức ngoài nước",
    "Tin tức chung",
  ];

  const fetchLatestBlog = async ({ page = 1 }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        VITE_BASE_URL + "/api/blog/latest-blog",
        { page }
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
    console.log(blogs);
  }, []);

  return (
    <div
      className={`flex flex-col items-center min-w-full min-h-screen ${
        theme == "light" ? "bg-white" : "bg-darkModeBackgroundColor"
      }`}
    >
      <NavBar theme={theme} />
      <div className="flex justify-between w-full px-40 my-10">
        {/* The latest blog */}
        <div className="w-[60%] bg-red-300// h-full">
          <nav className="topic-choice">
            {/* <div className="flex gap-3 flex-wrap">
              {categories.map((category, i) => {
                return (
                  <button
                    onClick={null}
                    className={`topic py-2 px-4 text-lg border-2 font-medium rounded-full hover:bg-black hover:text-white`}
                  >
                    {category}
                  </button>
                );
              })}
            </div> */}
          </nav>
          {loading ? (
            <Loader />
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

        {/* Trending blog */}
        <div className=""></div>
      </div>
    </div>
  );
};

export default BlogPage;
