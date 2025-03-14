// ./client/src/components/blog/BlogPost.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import BlackLike from "../../assets/icon/black/like.svg";
import BlackDislike from "../../assets/icon/black/dislike.svg";
import WhiteLike from "../../assets/icon/white/like.svg";
import WhiteDislike from "../../assets/icon/white/dislike.svg";
import BlackComment from "../../assets/icon/black/comment.svg";
import WhiteComment from "../../assets/icon/white/comment.svg";

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

  useState(() => {
    console.log(content);
  });

  return (
    <Link
      to={`/blog/${id}`}
      className="flex flex-row items-start border-b border-grey py-4 hover:bg-gray-50 hover:shadow-sm"
    >
      <div className="w-[600px] h-[250px] bg-red-200">
        <img src={null} className="w-full h-full aspect-square object-cover" />
      </div>

      <div className="flex flex-col items-center justify-between w-full h-[250px] ml-6">
        <div className="w-full">
          <h1 className="text-orange-500 font-semibold tracking-wider bg-green-200//">
            {category ? category : "The author did not enter the category"}
          </h1>
          <h1 className="blog-title text-2xl font-semibold line-clamp-2 mt-2">
            {title}
          </h1>
          <p className="blog-head text-md line-clamp-3 mt-4 bg-green-200//">
            {intro}
          </p>
        </div>

        <div className="flex w-full mt-4 items-center justify-start gap-6">
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
