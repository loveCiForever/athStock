import React from "react";
import { toast } from "react-toastify";
import Tag from "./Tags.jsx";

const PublishForm = ({ blog, setBlog, setEditorState }) => {
  const maxLimit = 200;
  const tagLimit = 10;
  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      const tag = e.target.value;
      if (blog.tags.includes(tag)) return (e.target.value = "");
      if (!tag) return;
      if (blog.tags.length >= tagLimit)
        return toast.error("you hit the limit of tags");
      setBlog((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      e.target.value = "";
    }
  };
  const publishBlog = () => {
    console.log(blog);
  };

  return (
    <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
      <button
        className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top[10%] hover:bg-dark-grey/10 rounded-full flex items-center justify-center"
        onClick={() => setEditorState("editor")}
      >
        <i className="fi fi-br-cross"></i>
      </button>
      <div className="max-w-[550px] center">
        <p className="text-dark-grey mb-1">Preview</p>
        <div className="w-full aspect-video  border-4  border-grey rounded-lg overflow-hidden bg-grey mt-4">
          <img src={blog.banner} alt={blog.title} />
        </div>
        <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-1">
          {blog.title}
        </h1>
        <p className="line-clamp-1">{blog.des}</p>
      </div>
      <div className="border-grey lg:border-1 lg:pl-8">
        <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
        <input
          type="text"
          placeholder="Blog Title"
          value={blog.title}
          onChange={(e) =>
            setBlog((prev) => ({ ...prev, title: e.target.value }))
          }
          className="input-box pl-4"
        />
        <p className="text-dark-grey mb-2 mt-9">
          Short description about your blog
        </p>
        <textarea
          maxLength={maxLimit}
          value={blog.des}
          className="h-40 resize-none leading-7 input-box"
          onChange={(e) =>
            setBlog((prev) => ({ ...prev, des: e.target.value }))
          }
          onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : null)}
        />
        <p
          className={`text-dark-grey text-right ${
            +blog.des.length === maxLimit ? "text-red" : ""
          }`}
        >
          {maxLimit - blog.des.length} characters left
        </p>
        <p className="text-dark-grey mb-2 mt-9">
          Topics - (helps to searching and ranking your blog post)
        </p>
        <div className="relative input-box pl-2 py-2 pb-4">
          <input
            type="text"
            placeholder="Topic"
            className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
            onKeyDown={handleKeyDown}
          />
          {blog.tags.map((tag, i) => (
            <Tag key={i} tag={tag} i={i} setBlog={setBlog} />
          ))}
        </div>
        <p className="mt-1 mb-4 text-dark-grey text-right">
          {tagLimit - blog.tags.length} Tags left
        </p>
        <button className="btn-dark px-8" onClick={publishBlog}>
          Publish
        </button>
      </div>
    </section>
  );
};

export default PublishForm;
