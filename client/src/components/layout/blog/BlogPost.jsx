// ./client/src/components/blog/BlogPost.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import BlackLike from "../../../assets/icon/black/like.svg";
import BlackDislike from "../../../assets/icon/black/dislike.svg";
import WhiteLike from "../../../assets/icon/white/like.svg";
import WhiteDislike from "../../../assets/icon/white/dislike.svg";
import BlackComment from "../../../assets/icon/black/comment.svg";
import WhiteComment from "../../../assets/icon/white/comment.svg";
import Banner from "../../../assets/picture/banner.jpg";
import { UppercaseFullString } from "../../utils/TextFormat";
import { UppercaseFirstLetterEachWord } from "../../utils/TextFormat";

const BlogPost = ({ author, content, theme }) => {
  let {
    publishedAt,
    tags,
    title,
    intro,
    category,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { fullName, profile_img, userName } = author;

  return (
    <Link
      to={`/blog/${id}`}
      className="flex flex-row items-start border-b border-grey py-4 hover:bg-gray-50 hover:shadow-sm"
    >
      <div className="h-[250px]">
        <img src={Banner} className="w-full h-full object-cover rounded-lg" />
      </div>

      <div className="flex flex-col items-center justify-between w-full h-[250px] ml-6">
        <div className="w-full">
          <div className="w-full flex gap-4 items-center justify-start">
            <h1 className="text-orange-500 font-extrabold bg-green-200//">
              {category
                ? UppercaseFullString(category)
                : "The author did not enter the category"}
            </h1>
            <h2 className="text-sm">{publishedAt}</h2>
          </div>

          <h1 className="blog-title text-2xl font-semibold line-clamp-2 mt-2">
            {title}
          </h1>
          <p className="blog-head text-md line-clamp-3 mt-4 bg-green-200//">
            {intro}
          </p>
        </div>

        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center justify-start gap-6">
            <div className="flex items-center justify-center ">
              <h1 className="text-xl font-semibold pt-1">10</h1>
              <img src={BlackLike} alt="black icon like" className="ml-2 w-5" />
            </div>

            <div className="flex items-center justify-center ">
              <h1 className="text-xl font-semibold pt-1">10</h1>
              <img
                src={BlackDislike}
                alt="black icon dislike"
                className="ml-2 w-5"
              />
            </div>

            <div className="flex items-center justify-center">
              <h1 className="text-xl font-semibold pt-1">10</h1>
              <img
                src={BlackComment}
                alt="black icon comment"
                className="ml-2 w-5"
              />
            </div>
          </div>

          <h2 className="text-md font-semibold">
            Tác giả: {UppercaseFirstLetterEachWord(fullName)}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default BlogPost;

/* modify lai giao dien cua post card -------> OK
 * tim cach upload image, banner cho post.
 * chinh sua publish form: topic tu dien -> topic cho san
 * topic cu -> tag
 *
 * chinh sua blog model: them category
 * them dislike
 *
 */
