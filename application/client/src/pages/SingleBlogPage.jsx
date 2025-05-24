import axios from "axios";
import { CircleChevronDown, CircleChevronUp, CircleX } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DefaultBanner from "../assets/images/blogBanner.png";
import { blogStructure } from "../components/layout/blog/BlogStructure";
import Footer from "../components/layout/footer/Footer.jsx";
import Header from "../components/layout/header/Header";
import { useAuthContext } from "../hooks/AuthContext.jsx";
import { UppercaseFirstLetterEachWord } from "../utils/formatString.jsx";
export const BlogContext = createContext({});

const SingleBlogPage = ({ theme }) => {
  let { blog_id } = useParams();
  let [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  const { user, userLoading, getAccessToken } = useAuthContext();
  const [blogPoint, setBlogPoint] = useState();
  const authHeaders = user
    ? { headers: { Authorization: `Bearer ${getAccessToken()}` } }
    : {};

  const VITE_BASE_URL =
    import.meta.env.VITE_IP + ":" + import.meta.env.VITE_SERVER_PORT;

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

  const [voteStatus, setVoteStatus] = useState("");
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
    document.title = blog.category + " - " + blog.title;
  });

  return (
    <div
      className={`
        blog-page
        flex flex-col items-center min-h-screen w-full
        ${theme === "light" ? "bg-white" : "bg-black/90"}
      `}
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
              <h2 className="text-black/60 text-[16px]">
                {new Date(blog.publishedAt).toLocaleDateString()}
              </h2>
              <h2 className="font-bold text-black/80">
                {blog.author
                  ? UppercaseFirstLetterEachWord(
                      blog.author.personal_info.full_name
                    )
                  : "Khuyết danh"}
              </h2>
            </div>

            <h2 className="mt-3 text-base font-bold tracking-wide xl:text-lg">
              {blog.intro}
            </h2>

            <div className="flex items-center justify-center w-full mt-4 mb-6">
              <img
                src={blog.banner || DefaultBanner}
                alt="banner"
                className="w-full"
              />
            </div>

            {blog.content[0]?.blocks.map((block) =>
              block.type === "paragraph" ? (
                <p
                  key={block.id}
                  className="mt-2 text-base tracking-wide xl:text-lg"
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              ) : null
            )}
          </div>

          {/* —— STICKY PANEL —— */}
          <aside
            className={`
              flex flex-row flex-1
              sticky top-10
              w-full
              xl:top-[calc(100px+2.5rem)]
              xl:mb-0 xl:ml-10 my-10 xl:my-0
              z-10 gap-2
            `}
          >
            <div className="flex flex-col items-center justify-center gap-4 pr-2 rounded-lg">
              <div className="flex flex-col items-center rounded-lg justify-center gap-4 p-4 bg-white">
                {" "}
                <button
                  onClick={() => {
                    likeByBlogId({ blog_id: blog.blog_id });
                  }}
                  className={`rounded-full hover:bg-gray-300 ${
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
                  className={`rounded-full hover:bg-gray-300 ${
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
                className={`p-4 rounded-lg bg-white hover:bg-gray-300 ${
                  voteStatus === "dislike" ? "" : ""
                }`}
              >
                <CircleX size={35} strokeWidth={2} color="red" />
              </button>
            </div>

            <div className="w-full h-auto p-4 text-center bg-white rounded-lg xl:flex-1">
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
