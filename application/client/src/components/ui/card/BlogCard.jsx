// applications/client/src/components/ui/card/BlogCard.jsx

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  UppercaseFirstLetterEachWord,
  UppercaseFullString,
  checkStringBo,
} from "../../../utils/formatString";

import { getDayMonthYear } from "../../../utils/formatDate";
import { ThemeContext } from "../../../hooks/useTheme";
import { useContext } from "react";
import DefaultBanner from "../../../assets/images/blogBanner.png";
import { useNavigate } from "react-router-dom";
const BlogCard = ({ author, blog, viewMode, maxTags = 3 }) => {
  const {
    publishedAt,
    title,
    intro,
    category,
    activity: { total_likes, total_dislikes },
    blog_id: id,
    tags,
  } = blog;
  const { full_name } = author;
  const { theme } = useContext(ThemeContext);

  const bannerImage = blog?.content[0]?.blocks?.find(
    (block) => block.type === "image"
  )?.data?.file?.url;
  const navigate = useNavigate();
  const displayTags = tags?.slice(0, maxTags);
  const remainingTags = tags?.length > maxTags ? tags.length - maxTags : 0;
  const handleTagClick = (e, tag) => {
    e.preventDefault(); // Prevent Link navigation
    navigate(`/blog/tag/${encodeURIComponent(tag)}`);
  };

  // console.log(author);
  // console.log(blog);

  return (
    <Link
      to={`/blog/${id}`}
      className={`blog-card flex flex-col lg:flex-row items-start w-full p-6
        ${viewMode === "list" && "border-b border-gray-300"}
        ${
          viewMode === "grid" &&
          "border-1 rounded-lg border-gray-100 hover:shadow-xl"
        }
        ${theme === "dark-theme" ? "hover:bg-black/10" : "hover:bg-gray-100"}`}
    >
      {viewMode === "list" && (
        <div className="w-full lg:w-[500px] lg:h-[250px] mr-6">
          <img
            src={bannerImage || DefaultBanner}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <div
        className={`flex flex-col justify-between w-full ${
          viewMode === "grid"
            ? "lg:h-[200px] xl:h-[300px]"
            : "lg:h-[200px] xl:h-[250px]"
        }  `}
      >
        <div className="w-full">
          <div className="w-full flex gap-4 items-center justify-start">
            <h1 className="text-orange-500 text-sm lg:text-base xl:text-md font-extrabold tracking-wide">
              {checkStringBo(category)
                ? UppercaseFullString(category)
                : "Failed to get category"}
            </h1>
            <hr
              className={`h-4 w-[2px] border-none ${
                theme === "dark-theme" ? "bg-gray-300" : "bg-black/30"
              }`}
            />
            <h2
              className={`text-sm lg:text-base xl:text-sm ${
                theme === "dark-theme" ? "" : "text-black/60"
              }`}
            >
              {getDayMonthYear(publishedAt)}
            </h2>
          </div>

          <h1 className="blog-title text-base md:text-xl xl:text-2xl font-bold line-clamp-2 mt-2">
            {checkStringBo(title) ? title : "Failed to get title"}
          </h1>
          <p className="blog-head text-sm md:text-base tracking-wide line-clamp-3 mt-2 xl:mt-4 bg-green-200//">
            {checkStringBo(intro) ? intro : "Failed to get introduction"}
          </p>
        </div>

        <div className="flex flex-col items-start justify-between w-full mt-2 lg:mt-2 gap-2">
          <div className="flex flex-wrap gap-2">
            {displayTags?.map((tag, index) => (
              <span
                key={index}
                onClick={(e) => handleTagClick(e, tag)}
                className={`px-4 py-1 text-xs rounded-lg cursor-pointer
              ${theme === "dark-theme" ? "bg-black/30" : "bg-gray-200"}
              hover:bg-orange-500 hover:text-white transition-colors
            `}
              >
                {tag}
              </span>
            ))}
            {remainingTags > 0 && (
              <span
                className={`px-4 py-1 text-xs rounded-lg ${
                  theme === "dark-theme" ? "bg-black/30" : "bg-gray-200"
                }`}
              >
                +{remainingTags} more
              </span>
            )}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-start gap-6 lg:gap-6">
              <div className="flex items-center justify-center gap-2 ">
                <h1 className="text-md md:text-lg xl:text-md font-semibold pt-1">
                  {total_likes}
                </h1>
                <ThumbsUp size={18} />
              </div>

              <div className="flex items-center justify-center gap-2 ">
                <h1 className="text-md md:text-lg xl:text-md font-semibold pt-1">
                  {total_dislikes}
                </h1>
                <ThumbsDown size={18} />
              </div>
            </div>

            <h2 className="text-sm md:text-base xl:text-base font-semibold">
              {checkStringBo(full_name)
                ? UppercaseFirstLetterEachWord(full_name)
                : "Failed to get full_name"}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
