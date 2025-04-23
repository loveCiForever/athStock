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
  let { fullName, profile_img, userName } = author;

  useState(() => {
    // console.log(id);
  });

  return (
    <Link
      to={`/blog/${id}`}
      className="flex flex-col lg:flex-row items-start border-b border-grey py-4 hover:bg-gray-50 hover:shadow-sm min-w-[770px]// bg-red-100// mt-4"
    >
      <div className="w-full lg:h-[200px] lg:w-[400px] xl:h-[250px] xl:w-[500px]">
        <img src={banner} className="w-full h-full object-cover rounded-md" />
      </div>

      <div className="flex flex-col items-center justify-between  h-auto xl:h-[250px] ml-0 lg:ml-6 mt-4 lg:mt-0">
        <div className="w-full">
          <div className="w-full flex gap-4 items-center justify-start">
            <h1 className="text-orange-500 text-sm xl:text-lg font-extrabold tracking-wide bg-green-200//">
              {category
                ? UppercaseFullString(category)
                : "DID NOT SET CATEGORY"}
            </h1>
            <h2 className="text-sm xl:text-lg">{getFullDay(publishedAt)}</h2>
          </div>

          <h1 className="blog-title text-md md:text-xl xl:text-2xl font-semibold line-clamp-2 mt-2">
            {title}
          </h1>
          <p className="blog-head text-sm md:text-md line-clamp-3 mt-2 xl:mt-4 bg-green-200//">
            {intro}
          </p>
        </div>

        <div className="flex items-center justify-between w-full mt-2 lg:mt-0 ">
          <div className="flex items-center justify-start gap-4 lg:gap-6">
            <div className="flex items-center justify-center ">
              <h1 className="text-md md:text-md xl:text-lg font-semibold pt-1">
                {total_likes}
              </h1>
              <img
                src={BlackLike}
                alt="black icon like"
                className="ml-2 w-4 lg:w-5"
              />
            </div>

            <div className="flex items-center justify-center ">
              <h1 className="text-md xl:text-lg font-semibold pt-1">
                {total_dislikes}
              </h1>
              <img
                src={BlackDislike}
                alt="black icon dislike"
                className="ml-2 w-4 lg:w-5"
              />
            </div>

            {/* <div className="flex items-center justify-center">
              <h1 className="text-md xl:text-lg font-semibold pt-1">
                10 {comments}
              </h1>
              <img
                src={BlackComment}
                alt="black icon comment"
                className="ml-2 w-4 lg:w-5"
              />
            </div> */}
          </div>

          <h2 className="text-sm md:text-md xl:text-base font-semibold">
            Tác giả: {UppercaseFirstLetterEachWord(fullName)}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
