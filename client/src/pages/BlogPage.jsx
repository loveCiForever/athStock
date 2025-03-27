import { useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/layout/navbar/NavBar";
import BlackLike from "../assets/icon/black/like.svg";
import BlackDislike from "../assets/icon/black/dislike.svg";
import BlackComment from "../assets/icon/black/comment.svg";
import { getFullDay } from "../components/utils/DateFormat";
import { blogStructure } from "../components/layout/blog/BlogStructure";
import { UppercaseFirstLetterEachWord } from "../components/utils/TextFormat";
import DefaultBanner from "../assets/picture/blogBanner.png";
import { useAuthContext } from "../components/hooks-services/AuthContext";

export const BlogContext = createContext({});

const BlogPage = ({ theme }) => {
  let { blog_id } = useParams();
  let [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  // let [user, setUser] = useState(null);
  // const { fullName, userName, profile_img } = useState(user);

  const VITE_BASE_URL =
    import.meta.env.VITE_IP + ":" + import.meta.env.VITE_SERVER_PORT;

  const fetchBlogById = async ({ blog_id }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        VITE_BASE_URL + "/api/blog/get-blog-by-id",
        { blog_id }
      );
      // console.log(data.blog[0]);
      setBlog(data.blog[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const likeByBlogId = async ({ blog_id }) => {
    setLoading(true);
    try {
      // console.log("REQUEST blog_id: ", blog_id);
      const { data } = await axios.post(
        VITE_BASE_URL + "/api/blog/like-blog-by-id",
        { blog_id }
      );
      // console.log(data);
      fetchBlogById({ blog_id });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const dislikeByBlogId = async ({ blog_id }) => {
    setLoading(true);
    try {
      // console.log("REQUEST blog_id: ", blog_id);
      const { data } = await axios.post(
        VITE_BASE_URL + "/api/blog/dislike-blog-by-id",
        { blog_id }
      );
      // console.log(data);
      fetchBlogById({ blog_id });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogById({ blog_id: blog_id });
  }, [blog_id]);

  // useEffect(() => {
  //   if (blog.title || blog.intro || blog.banner || blog.content.length > 0) {
  //     console.log(blog);
  //   }
  // }, [blog]);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  return (
    <div
      className={`flex flex-col items-center min-w-full min-h-screen${
        theme == "light" ? "bg-white" : "bg-darkModeBackgroundColor"
      }`}
    >
      <NavBar theme={theme} />

      <div className="flex justify-center w-full px-40 my-10 gap-20">
        <div className="w-[50%] bg-red-300// h-full">
          <h1 className="text-5xl font-extrabold tracking-tight">
            {blog.title}
          </h1>
          <div className="w-full flex justify-between items-center mt-6">
            <h2 className=" text-black/60">{getFullDay(blog.publishedAt)}</h2>
            <h2 className="text-black/60 font-bold">
              {" "}
              Tác giả:{" "}
              {UppercaseFirstLetterEachWord(blog.author.personal_info.fullName)}
            </h2>
          </div>

          <h2 className="mt-4 text-xl font-bold tracking-wide">{blog.intro}</h2>

          <div className="mt-4 mb-6 flex items-center justify-center w-full">
            <img
              src={blog.banner ? blog.banner : DefaultBanner}
              alt="banner"
              className="w-full"
            />
          </div>

          {blog.content.length > 0 &&
            blog.content[0].blocks.map((block) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p
                      key={block.id}
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                      className="mt-2 text-lg tracking-wide"
                    />
                  );
                default:
                  return null;
              }
            })}
        </div>

        <div className="w-auto border-[1px]/ border-gray-300 h-fit">
          <div className="flex items-center justify-between h-full gap-6/ w-full">
            <button
              onClick={() => likeByBlogId({ blog_id })}
              className="flex items-center justify-center border-[1px] border-gray-400 px-8 py-2 h-auto rounded-l-lg hover:bg-gray-200 active:scale-[.95] active:duration-90 transition-all "
            >
              <h1 className="text-xl font-semibold pt-1">
                {blog.activity.total_likes}
              </h1>
              <img src={BlackLike} alt="black icon like" className="ml-2 w-5" />
            </button>

            <button
              onClick={() => dislikeByBlogId({ blog_id })}
              className="flex items-center justify-center border-[1px] border-gray-400 px-8 py-2 h-auto hover:bg-gray-200 active:scale-[.95] active:duration-90 transition-all "
            >
              <h1 className="text-xl font-semibold pt-1">
                {blog.activity.total_dislikes}
              </h1>
              <img
                src={BlackDislike}
                alt="black icon like"
                className="ml-2 w-5"
              />
            </button>

            <div className="flex items-center justify-center border-[1px] border-gray-400 px-8 py-2 h-auto hover:bg-gray-200 active:scale-[.95] active:duration-90 transition-all ">
              <h1 className="text-xl font-semibold pt-1">10</h1>
              <img
                src={BlackComment}
                alt="black icon comment"
                className="ml-2 w-5"
              />
            </div>

            <button className="flex items-center justify-center border-[1px] border-gray-400 px-8 py-2 h-auto rounded-r-lg hover:bg-gray-200 active:scale-[.95] active:duration-90 transition-all ">
              <h1 className="text-lg font-semibold pt-1">Report</h1>
            </button>
          </div>

          <div className="mt-4 flex items-start justify-center gap-6 border-[1px] border-gray-400 h-[500px] w-full rounded-lg">
            <div className="w-full flex flex-row p-4">
              {/* {user && user.profile_img ? (
                <img
                  src={user.profile_img}
                  alt="profile image"
                  className="user-profile-img w-8 h-8 lg:w-8 lg:h-8 rounded-full"
                />
              ) : (
                <div>No profile image available</div>
              )} */}

              {/* <img src={profile_img} alt="" className="w-8 h-8" /> */}
              {/* {user && user.fullName ? (
                <h1 className="">{user.fullName}</h1>
              ) : (
                <div>No profile image available</div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

/**
  Bug: User can like unlimited ---> add is-like-by-user (verify by jwt)
 */
