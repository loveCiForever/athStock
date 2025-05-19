// ./client/src/components/blog/BlogPost.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import BlackLike from "../../../assets/icons/black/like.svg";
import BlackDislike from "../../../assets/icons/black/dislike.svg";
import WhiteLike from "../../../assets/icons/white/like.svg";
import WhiteDislike from "../../../assets/icons/white/dislike.svg";
import BlackComment from "../../../assets/icons/black/comment.svg";
import WhiteComment from "../../../assets/icons/white/comment.svg";
import Banner from "../../../assets/images/banner.jpg";
import { UppercaseFullString } from "../../../utils/formatText.jsx";
import { UppercaseFirstLetterEachWord } from "../../../utils/formatText.jsx";
import { getFullDay } from "../../../utils/formatDate";
import UpVote from "../../../assets/icons/UpVoteIcon.svg";
import DownVote from "../../../assets/icons/DownVoteIcon.svg";

const BlogCard = ({ author, content, theme }) => {
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

  return (
    <Link
      to={`/blog/${id}`}
      className="flex flex-col lg:flex-row items-start w-full border-b border-grey py-2 md:py-8 hover:bg-gray-50 hover:shadow-sm"
    >
      <div className="w-full lg:w-[500px] lg:h-[200px] xl:w-[500px] xl:h-[250px]">
        <img src={banner} className="w-full h-full object-cover rounded-md" />
      </div>

      <div className="flex flex-col items-stretch// justify-between w-full ml-0 lg:ml-6 mt-4 lg:mt-0 bg-green-200// lg:h-[200px] xl:h-[250px]">
        <div className="w-full">
          <div className="w-full flex gap-4 items-center justify-start">
            <h1 className="text-orange-500 text-sm lg:text-base xl:text-lg font-extrabold tracking-wide bg-green-200//">
              {category
                ? UppercaseFullString(category)
                : "DID NOT SET CATEGORY"}
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
          <div className="flex items-center justify-start gap-4 lg:gap-2">
            <div className="flex items-center justify-center ">
              <h1 className="text-md md:text-lg xl:text-lg font-semibold pt-1">
                {total_likes}
              </h1>
              <img
                src={UpVote}
                alt="black icon like"
                className="ml-0 w-5 md:w-6"
              />
            </div>

            <div className="flex items-center justify-center ">
              <h1 className="text-md md:text-lg font-semibold pt-1">
                {total_dislikes}
              </h1>
              <img
                src={DownVote}
                alt="black icon dislike"
                className="ml-0 w-5 md:w-6"
              />
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
