import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../hooks/useTheme";
import Header from "../components/layout/header/Header";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import "../index.css";
import { UppercaseFirstLetterEachWord } from "../utils/formatString";
import { useAuthContext } from "../hooks/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DEVELOPMENT_BLOG_SERVER_BASE_URL } from "../utils/config";
import { BlogStructure } from "../components/layout/blog/BlogStructure";
import { Link } from "react-router-dom";
import DefaultBanner from "../assets/images/blogBanner.png";
import { GridIcon, List as ListIcon } from "lucide-react";
const ProfilePage = () => {
  useEffect(() => {
    document.title = "Profile";
  }, []);

  const [displayType, setDisplayType] = useState("grid");
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [renderUser, setRenderUser] = useState();
  const [editMode, setEditMode] = useState({
    personalInfo: false,
    socialLinks: false,
  });
  const { logout, getAccessToken, user } = useAuthContext();
  const authHeaders = user
    ? { headers: { Authorization: `Bearer ${getAccessToken()}` } }
    : {};

  const VITE_BASE_URL = import.meta.env.VITE_LOCAL_BLOG_API_SERVER;

  const [formData, setFormData] = useState({
    personal_info: {
      full_name: "",
      user_name: "",
      bio: "",
      profile_img: "",
    },
    social_links: {
      youtube: "",
      instagram: "",
      facebook: "",
      twitter: "",
      github: "",
    },
  });

  useEffect(() => {
    if (renderUser) {
      setFormData({
        personal_info: {
          full_name: renderUser.personal_info.full_name,
          user_name: renderUser.personal_info.user_name,
          bio: renderUser.personal_info.bio,
          profile_img: renderUser.personal_info.profile_img,
        },
        social_links: { ...renderUser.social_links },
      });
      setLoading(false);
    }
  }, [renderUser]);

  useEffect(() => {
    const handleGetUserInfo = async () => {
      try {
        const response = await axios.get(
          `${DEVELOPMENT_BLOG_SERVER_BASE_URL}/api/user/get-user-info`,
          authHeaders
        );
        console.log(response);
        setRenderUser(response.data.data.user);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    handleGetUserInfo();
  }, [user]);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCancel = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...user[section] },
    }));
    setEditMode((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  const [userBlogs, setUserBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!renderUser?._id) return;

      setLoadingBlogs(true);
      try {
        const response = await axios.get(
          `${DEVELOPMENT_BLOG_SERVER_BASE_URL}/api/blog/author/${renderUser._id}`,
          {
            params: { page: 1, limit: 10 },
            ...authHeaders,
          }
        );
        setUserBlogs(response.data.data.blogs);
      } catch (error) {
        console.error("Error fetching user blogs:", error);
        toast.error("Failed to fetch blogs");
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchUserBlogs();
  }, [renderUser?._id]);

  if (loading) {
    return (
      <div
        className={`${theme} flex flex-col items-center justify-center min-h-screen`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={`${theme} profile-page flex flex-col min-h-screen`}>
      <Header />

      <main className="container mx-auto py-8 px-6 sm:px-10 md:px-14 xl:px-40 mt-20 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`md:col-span-1 py-6  rounded-lg ${
              theme === "dark-theme" ? "bg-zinc-900/50" : "bg-gray-100"
            }  `}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6">
              <img
                src={renderUser.personal_info.profile_img || "/placeholder.svg"}
                alt={renderUser.personal_info.full_name}
                className="w-1/2 rounded-full object-cover border-4 border-orange-400"
              />
            </div>

            {/* Personal Information */}
            <div className={`bg-bg-secondary rounded-lg px-10 mt-10 `}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Personal Information</h2>
                {!editMode.personalInfo ? (
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, personalInfo: true }))
                    }
                    className="p-1 text-gray-500 hover:bg-orange-300 dark:hover:bg-white rounded-md"
                  >
                    <PencilIcon size={20} />
                  </button>
                ) : null}
              </div>

              {editMode.personalInfo ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.personal_info.full_name}
                      onChange={(e) =>
                        handleInputChange(
                          "personal_info",
                          "full_name",
                          e.target.value
                        )
                      }
                      className={`w-full p-2 border ${
                        theme === "dark-theme"
                          ? "border-zinc-700"
                          : "border-gray-200"
                      } rounded-md bg-bg-primary text-text-primary`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.personal_info.user_name}
                      onChange={(e) =>
                        handleInputChange(
                          "personal_info",
                          "user_name",
                          e.target.value
                        )
                      }
                      className={`w-full p-2 border ${
                        theme === "dark-theme"
                          ? "border-zinc-700"
                          : "border-gray-200"
                      } rounded-md bg-bg-primary text-text-primary`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      type="text"
                      value={formData.personal_info.bio}
                      onChange={(e) =>
                        handleInputChange(
                          "personal_info",
                          "bio",
                          e.target.value
                        )
                      }
                      className={`w-full p-2 h-32 resize-none border ${
                        theme === "dark-theme"
                          ? "border-zinc-700"
                          : "border-gray-200"
                      } rounded-md bg-bg-primary text-text-primary`}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-0 font-bold">
                    <button
                      onClick={() => handleSave("personalInfo")}
                      className={`px-3 py-1 text-green-500 rounded-md active:scale-[.95] active:duration-75 transition-all ${
                        theme === "dark-theme"
                          ? "hover:bg-zinc-700"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel("personalInfo")}
                      className={`px-3 py-1 text-red-500 rounded-md active:scale-[.95] active:duration-75 transition-all ${
                        theme === "dark-theme"
                          ? "hover:bg-zinc-700"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Full Name
                    </p>
                    <p>
                      {UppercaseFirstLetterEachWord(
                        renderUser.personal_info.full_name
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Username
                    </p>
                    <p>@{renderUser.personal_info.user_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p>{renderUser.personal_info.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Joined
                    </p>
                    <p>{new Date(renderUser.joinedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Bio
                    </p>
                    <p>{renderUser.personal_info.bio}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className={`bg-bg-secondary rounded-lg px-10 mt-6 mb-0 `}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Social Links</h2>
                {!editMode.socialLinks ? (
                  <button
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, socialLinks: true }))
                    }
                    className="p-1 text-gray-500 hover:bg-orange-400 dark:hover:bg-white rounded-md"
                  >
                    <PencilIcon size={20} />
                  </button>
                ) : null}
              </div>

              {editMode.socialLinks ? (
                <div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      YouTube
                    </label>
                    <input
                      type="text"
                      value={formData.social_links.youtube}
                      onChange={(e) =>
                        handleInputChange(
                          "social_links",
                          "youtube",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-md bg-bg-primary text-text-primary"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.social_links.instagram}
                      onChange={(e) =>
                        handleInputChange(
                          "social_links",
                          "instagram",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-md bg-bg-primary text-text-primary"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={formData.social_links.facebook}
                      onChange={(e) =>
                        handleInputChange(
                          "social_links",
                          "facebook",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-md bg-bg-primary text-text-primary"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Twitter
                    </label>
                    <input
                      type="text"
                      value={formData.social_links.twitter}
                      onChange={(e) =>
                        handleInputChange(
                          "social_links",
                          "twitter",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-md bg-bg-primary text-text-primary"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      GitHub
                    </label>
                    <input
                      type="text"
                      value={formData.social_links.github}
                      onChange={(e) =>
                        handleInputChange(
                          "social_links",
                          "github",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-md bg-bg-primary text-text-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleSave("social_links")}
                      className="px-3 py-1 bg-green-500 text-white rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel("social_links")}
                      className="px-3 py-1 bg-red-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(renderUser.social_links).map(
                    ([platform, link]) =>
                      link && (
                        <a
                          key={platform}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-500 hover:underline"
                        >
                          <span className="capitalize">{platform}</span>
                        </a>
                      )
                  )}

                  {Object.values(renderUser.social_links).every(
                    (link) => !link
                  ) && (
                    <p className="text-gray-500 dark:text-gray-400">
                      No social links added yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Blog Posts */}
          <div className="md:col-span-2">
            <div>
              <div
                className={`justify-center md:justify-start gap-6  grid grid-cols-5 p-0 rounded-lg  ${
                  theme === "dark-theme" ? "bg-zinc-900/50//" : ""
                }`}
              >
                <div
                  className={`text-center px-4 py-3 bg-white/ rounded-md ${
                    theme === "dark-theme" ? "bg-zinc-900/50" : "bg-gray-100"
                  } `}
                >
                  <p className="text-2xl font-bold">
                    {renderUser.account_info.total_posts}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Posts
                  </p>
                </div>
                <div
                  className={`text-center px-4 py-3 bg-white/ rounded-md ${
                    theme === "dark-theme" ? "bg-zinc-900/50" : "bg-gray-100"
                  } `}
                >
                  <p className="text-2xl font-bold">
                    {renderUser.account_info.total_reads}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reads
                  </p>
                </div>
                <div
                  className={`text-center px-4 py-3 bg-white/ rounded-md ${
                    theme === "dark-theme" ? "bg-zinc-900/50" : "bg-gray-100"
                  } `}
                >
                  <p className="text-2xl font-bold">
                    {renderUser.activities.like.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Likes
                  </p>
                </div>
                <div
                  className={`text-center px-4 py-3 bg-white/ rounded-md ${
                    theme === "dark-theme" ? "bg-zinc-900/50" : "bg-gray-100"
                  } `}
                >
                  <p className="text-2xl font-bold">
                    {renderUser.activities.dislike.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dislikes
                  </p>
                </div>
                <div
                  className={`text-center px-4 py-3 bg-white/ rounded-md ${
                    theme === "dark-theme" ? "bg-zinc-900/50" : "bg-gray-100"
                  } `}
                >
                  <p className="text-2xl font-bold">
                    {new Date(renderUser.joinedAt).getFullYear()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Joined
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`bg-bg-secondary rounded-lg p-10 mt-6 ${
                theme === "dark-theme" ? "bg-zinc-900/50" : "bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Posts</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDisplayType("grid")}
                    className={`p-2 rounded-md transition-all ${
                      displayType === "grid"
                        ? "bg-orange-500 text-white"
                        : "text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700"
                    }`}
                    title="Grid view"
                  >
                    <GridIcon size={20} />
                  </button>
                  <button
                    onClick={() => setDisplayType("list")}
                    className={`p-2 rounded-md transition-all ${
                      displayType === "list"
                        ? "bg-orange-500 text-white"
                        : "text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700"
                    }`}
                    title="List view"
                  >
                    <ListIcon size={20} />
                  </button>
                </div>
              </div>

              {loadingBlogs ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : userBlogs.length > 0 ? (
                <div
                  className={`grid gap-4 ${
                    displayType === "grid"
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {userBlogs.map((blog) => (
                    <Link
                      to={`/blog/${blog.blog_id}`}
                      key={blog.blog_id}
                      className={`border-gray-200 border-[1px] rounded-md overflow-hidden hover:shadow-md transition-shadow ${
                        displayType === "list" ? "flex" : ""
                      }`}
                    >
                      <div className={displayType === "list" ? "w-1/3" : ""}>
                        <img
                          src={
                            blog.content?.[0]?.blocks?.find(
                              (block) => block.type === "image"
                            )?.data?.file?.url || "/placeholder.svg"
                          }
                          alt={blog.title}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                      <div
                        className={`p-4 ${
                          displayType === "list" ? "w-2/3" : ""
                        }`}
                      >
                        <h3 className="font-bold mb-2">{blog.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {blog.intro}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No published blogs yet
                  </p>
                  <Link
                    to="/blog/editor"
                    className="mt-4 inline-block px-4 py-2 text-orange-500 font-bold rounded-md border border-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    Create Your First Post
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
