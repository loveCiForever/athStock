import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  UppercaseFirstLetterEachWord,
  UppercaseFullString,
} from "../../../utils/formatString";
import { getFullDay } from "../../../utils/formatDate";
import { ThemeContext } from "../../../hooks/useTheme";
import { useContext } from "react";
const BlogCard = ({ author, content, viewMode }) => {
  let {
    publishedAt,
    tags,
    title,
    intro,
    category,
    activity: { total_likes, total_dislikes, comments },
    blog_id: id,
    banner,
  } = content;
  let { full_name, profile_img, user_name } = author;
  const { theme } = useContext(ThemeContext);
  return (
    <Link
      to={`/blog/${id}`}
      className={`flex flex-col lg:flex-row items-start w-full border-b border-gray-300 py-0 md:py-8 ${
        theme === "dark-theme" ? "hover:bg-black/10" : "hover:bg-gray-200"
      }`}
    >
      {viewMode === "list" && (
        <div className="w-full lg:w-[500px] lg:h-[200px] xl:w-[500px] xl:h-[250px]">
          <img src={banner} className="w-full h-full object-cover rounded-md" />
        </div>
      )}

      <div className="flex flex-col items-stretch// justify-between w-full ml-0 lg:ml-6 mt-4 lg:mt-0 bg-green-200// lg:h-[200px] xl:h-[250px]">
        <div className="w-full">
          <div className="w-full flex gap-4 items-center justify-start">
            <h1 className="text-orange-500 text-sm lg:text-base xl:text-lg font-extrabold tracking-wide bg-green-200//">
              {category ? UppercaseFullString(category) : "CHƯA PHÂN LOẠI"}
            </h1>
            <h2 className="text-sm lg:text-base xl:text-lg">
              {getFullDay(publishedAt)}
            </h2>
          </div>

          <h1 className="blog-title text-base md:text-xl xl:text-2xl font-semibold line-clamp-2 mt-2">
            {title}
          </h1>
          <p className="blog-head text-sm md:text-base tracking-wider line-clamp-3 mt-2 xl:mt-4 bg-green-200//">
            {intro}
          </p>
        </div>

        <div className="flex items-center justify-between w-full mt-2 lg:mt-2 bg-red-200//">
          <div className="flex items-center justify-start gap-6 lg:gap-6">
            <div className="flex items-center justify-center gap-2 ">
              <h1 className="text-md md:text-lg xl:text-lg font-semibold pt-1">
                {total_likes}
              </h1>
              <ThumbsUp size={20} />
            </div>

            <div className="flex items-center justify-center gap-2 ">
              <h1 className="text-md md:text-lg xl:text-lg font-semibold pt-1">
                {total_dislikes}
              </h1>
              <ThumbsUp size={20} />
            </div>
          </div>

          <h2 className="text-sm md:text-base xl:text-base font-semibold">
            Tác giả:{" "}
            {author ? UppercaseFirstLetterEachWord(full_name) : "Khuyết danh"}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
