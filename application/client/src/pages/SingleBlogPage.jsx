// application/client/src/page/SingleBlogPage.jsx

import axios from "axios";
import { CircleChevronDown, CircleChevronUp, CircleX } from "lucide-react";
import { createContext, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DefaultBanner from "../assets/images/blogBanner.png";
import { BlogStructure } from "../components/layout/blog/BlogStructure";
import Footer from "../components/layout/footer/Footer";
import Header from "../components/layout/header/Header";
import { useAuthContext } from "../hooks/AuthContext";
import { ThemeContext } from "../hooks/useTheme";
import {
  checkStringBo,
  UppercaseFirstLetterEachWord,
} from "../utils/formatString";
import { getDayMonthYear } from "../utils/formatDate";

const SingleBlogPage = () => {
  const [blog, setBlog] = useState(BlogStructure);
  const { theme } = useContext(ThemeContext);
  const { user } = useAuthContext();

  const { blog_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blogPoint, setBlogPoint] = useState(0);
  const [voteStatus, setVoteStatus] = useState("");
  const { getAccessToken } = useAuthContext();
  const authHeaders = user
    ? {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }
    : {};

  const fetchBlogById = async ({ blog_id }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/blog/get-blog-by-id",
        { blog_id }
      );
      const b = data.blog[0];
      setBlog(b);
      setBlogPoint(b.activity.total_likes - b.activity.total_dislikes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const likeByBlogId = async ({ blog_id }) => {
    setVoteStatus("like");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/blog/like-blog-by-id",
        { blog_id },
        authHeaders
      );
      fetchBlogById({ blog_id });
      setBlogPoint(blog.activity.total_likes - blog.activity.total_dislikes);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const dislikeByBlogId = async ({ blog_id }) => {
    setVoteStatus("dislike");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/blog/dislike-blog-by-id",
        { blog_id },
        authHeaders
      );

      fetchBlogById({ blog_id });
      setBlogPoint(blog.activity.total_likes - blog.activity.total_dislikes);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteStatusByBlogIdUserID = async ({ blog_id }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/blog/vote-status",
        { blog_id },
        authHeaders
      );
      if (data.data.hasDisliked) {
        setVoteStatus("dislike");
      } else if (data.data.hasLiked) {
        setVoteStatus("like");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const unVoteByBlogId = async ({ blog_id, voteStatus }) => {
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/blog/unvote",
        { blog_id, unvote: voteStatus },
        authHeaders
      );

      setVoteStatus("");
      fetchBlogById({ blog_id });
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogById({ blog_id: blog_id });
  }, [blog_id]);

  useEffect(() => {
    if (!user) return;
    fetchVoteStatusByBlogIdUserID({ blog_id });
  }, [user, blog_id]);

  useEffect(() => {
    document.title = blog.category ? blog.category : "" + blog.title;
  });

  console.log(blog);
  return (
    <div
      className={`single-blog-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary`}
    >
      <Header />

      <div className="body flex flex-col flex-1 w-full mt-5 ">
        <div className="flex flex-col items-start justify-start flex-1 w-full px-6 mt-5 xl:flex-row sm:px-10 md:px-14 xl:px-40">
          {/* —— MAIN CONTENT —— */}
          <div className="w-full xl:w-[65%] xl:mb-20">
            <h1 className="text-xl font-extrabold tracking-wide md:text-2xl xl:text-3xl">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between w-full mt-3 text-sm xl:mt-5 md:text-base xl:text-lg">
              <h2 className=" text-[16px]">
                {blog.publishedAt
                  ? getDayMonthYear(blog.publishedAt)
                  : "Failed to get publishedAt"}
              </h2>
              <h2 className="font-bold">
                {blog.author
                  ? checkStringBo(blog.author.personal_info.full_name)
                    ? UppercaseFirstLetterEachWord(
                        blog.author.personal_info.full_name
                      )
                    : "Khuyết danh"
                  : "Failed to get full_name"}
              </h2>
            </div>

            <h2 className="mt-3 text-base font-bold tracking-wide xl:text-lg">
              {blog.intro}
            </h2>

            {blog.content[0]?.blocks.map((block) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p
                      key={block.id}
                      className="mt-2 text-base tracking-wide xl:text-lg"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    />
                  );
                case "image":
                  return (
                    <div key={block.id} className="my-8">
                      <img
                        src={block.data.file.url}
                        alt={block.data.caption || "Blog image"}
                        className={`w-full ${
                          block.data.stretched ? "" : "max-w-xl mx-auto"
                        } ${
                          block.data.withBorder ? "border border-gray-300" : ""
                        } ${
                          block.data.withBackground ? "bg-gray-100 p-3" : ""
                        }`}
                      />
                      {block.data.caption && (
                        <p className="mt-2 text-center text-sm text-gray-500">
                          {block.data.caption}
                        </p>
                      )}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>

          <aside
            className={`
              flex flex-row flex-1
              sticky// top-10//
              w-full
              xl:top-[calc(100px+2.5rem)]
              xl:mb-0 xl:ml-10 my-10 xl:my-0
              z-10 gap-2
            `}
          >
            <div className="flex flex-col items-center justify-center gap-4 pr-2 rounded-lg">
              <div className="flex flex-col items-center rounded-lg justify-center gap-4 p-4 bg-whit//">
                {" "}
                <button
                  onClick={() => {
                    likeByBlogId({ blog_id: blog.blog_id });
                  }}
                  className={`rounded-full hover:text-green-400 ${
                    voteStatus === "like" ? "" : ""
                  }`}
                >
                  {voteStatus === "like" ? (
                    <CircleChevronUp size={35} strokeWidth={2} color="green" />
                  ) : (
                    <CircleChevronUp size={35} strokeWidth={1} />
                  )}
                </button>
                <h1 className="pt-1 text-2xl font-normal">{blogPoint}</h1>
                <button
                  onClick={() => {
                    dislikeByBlogId({ blog_id: blog.blog_id });
                  }}
                  className={`rounded-full hover:text-red-400 ${
                    voteStatus === "dislike" ? "" : ""
                  }`}
                >
                  {voteStatus === "dislike" ? (
                    <CircleChevronDown
                      size={35}
                      strokeWidth={2}
                      color="orange"
                    />
                  ) : (
                    <CircleChevronDown size={35} strokeWidth={1} />
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  unVoteByBlogId({
                    blog_id: blog.blog_id,
                    voteStatus: voteStatus,
                  });
                }}
                className={`p-4 rounded-lg bg-white// hover:text-gray-300 text-orange-400 ${
                  voteStatus === "dislike" ? "" : ""
                }`}
              >
                <CircleX size={35} strokeWidth={2} />
              </button>
            </div>

            <div className="w-full h-auto p-4 text-center bg-white// rounded-lg xl:flex-1">
              comment panel
            </div>
          </aside>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
};

export default SingleBlogPage;
