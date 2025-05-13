import axios from "axios";
import { CircleChevronDown, CircleChevronUp, CircleX } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DefaultBanner from "../assets/images/blogBanner.png";
import { blogStructure } from "../components/layout/blog/BlogStructure";
import Footer from "../components/layout/footer/Footer.jsx";
import NavBar from "../components/layout/nav-bar/NavBar.jsx";
import { useAuthContext } from "../hooks/AuthContext.jsx";
import { UppercaseFirstLetterEachWord } from "../utils/formatText.jsx";
export const BlogContext = createContext({});

const BlogPage = ({ theme }) => {
  let { blog_id } = useParams();
  let [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  const { user, userLoading } = useAuthContext();
  const [blogPoint, setBlogPoint] = useState();
  const authHeaders = user
    ? { headers: { Authorization: `Bearer ${user.access_token}` } }
    : {};
  // const [voteStatus, setVoteStatus] = useState({
  //   liked: false,
  //   disliked: false,
  // });

  // const fetchVoteStatus = async () => {
  //   if (!user) return;
  //   try {
  //     const res = await axios.get(
  //       `${VITE_BASE_URL}/api/blog/vote-status/${blog_id}`,
  //       authHeaders
  //     );
  //     console.log(res);

  //     setVoteStatus(res.data);
  //   } catch (err) {
  //     console.error("Could not get vote status", err);
  //   }
  // };

  const VITE_BASE_URL = import.meta.env.VITE_REMOTE_API_SERVER;

  const fetchBlogById = async ({ blog_id }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        VITE_BASE_URL + "/api/blog/get-blog-by-id",
        { blog_id }
      );
      const b = data.blog[0];
      // console.log(b);
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
      // 1. send the upvote
      // console.log(authHeaders);
      const { data } = await axios.post(
        VITE_BASE_URL + "/api/blog/like-blog-by-id",
        { blog_id },
        authHeaders
      );
      // 2. re-fetch
      fetchBlogById({ blog_id });
      // fetchVoteStatus();

      // 3. recalculate the point
      setBlogPoint(blog.activity.total_likes - blog.activity.total_dislikes);
    } catch (error) {
      // console.error(error.response.data.message);
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
        VITE_BASE_URL + "/api/blog/dislike-blog-by-id",
        { blog_id },
        authHeaders
      );

      fetchBlogById({ blog_id });
      // fetchVoteStatus();

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
    // console.log("auth header", authHeaders);
    setLoading(true);
    try {
      const { data } = await axios.post(
        VITE_BASE_URL + "/api/blog/vote-status",
        { blog_id },
        authHeaders
      );
      // console.log(data);
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
        VITE_BASE_URL + "/api/blog/unvote",
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

  // useEffect(() => {
  //   if (!voteStatus) return;
  //   console.log("voteStatus updated:", voteStatus);
  // }, [voteStatus]);

  return (
    <div
      className={`
        blog-page
        flex flex-col items-center min-h-screen w-full
        ${theme === "light" ? "bg-white" : "bg-black/90"}
      `}
    >
      <NavBar theme={theme} />

      <div className="body flex flex-col flex-1 w-full md:mt-[80px] xl:mt-[100px]">
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
            <div className="flex flex-col items-center justify-center gap-4 pr-2 bg-white rounded-lg">
              <div className="flex flex-col items-center rounded-lg justify-center gap-4 p-4 bg-gray-100">
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
                className={`p-4 rounded-lg bg-gray-100 hover:bg-gray-300 ${
                  voteStatus === "dislike" ? "" : ""
                }`}
              >
                <CircleX size={35} strokeWidth={2} color="red" />
              </button>
            </div>

            <div className="w-full h-auto p-4 text-center bg-gray-100 rounded-lg xl:flex-1">
              comment panel
            </div>
          </aside>
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
};

export default BlogPage;
