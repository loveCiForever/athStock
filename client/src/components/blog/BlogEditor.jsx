import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { app } from "../auth/firebase.jsx";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { tools } from "./Tools.jsx";
import EditorJS from "@editorjs/editorjs";
import Progress from "./Progress.jsx";

const BlogEditor = ({
  blog,
  setBlog,
  blogEditor,
  setBlogEditor,
  setEditorState,
}) => {
  const [progress, setProgress] = useState(0);
  const handleKeyDown = (e) => {
    if (e.keyCode == 13) {
      // enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog((prev) => ({ ...prev, title: input.value }));
  };

  const handleBannerUpload = async (e) => {
    const imgFile = e.target.files[0];
    if (imgFile) {
      setProgress(1);

      const formData = new FormData();
      formData.append("file", imgFile);
      formData.append("upload_preset", "blog-banner");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dnezwnstu/image/upload`,
          formData
        );

        const url = response.data.secure_url; // Get the URL of the uploaded image
        setProgress(0);
        setBlog((prev) => ({ ...prev, banner: url }));
      } catch (error) {
        toast.error("Failed to upload banner.");
        console.log(error);
        setProgress(0);
      }
    }
  };
  const editorRef = useRef(null);
  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "blogEditor",
        data: blog.content,
        tools: tools,
        placeholder: "Let's write an awesome blog",
      });
      setBlogEditor(editorRef.current);
    }
  }, []);

  const handlePublish = async () => {
    try {
      if (!blog.banner)
        return toast.error("Please upload banner image to publish");
      else if (!blog.title)
        return toast.error("Please write blog title to publish");
      if (blogEditor.isReady) {
        const data = await blogEditor.save();
        if (data.blocks.length <= 0 || !data) {
          return toast.error("Please write some content to publish");
        } else {
          setBlog((prev) => ({ ...prev, content: data }));
          setEditorState("publish");
        }
      }
    } catch (error) {
      toast.error("Error publishing");
    }
  };

  return (
    <div className="w-[600px]">
      {/* <p className="max-md:hidden text-2xl text-black line-clamp-1">
          {blog.title || "New Blog"}
        </p> */}
      {/* <div className="flex justify-between w-full bg-red-200// ml-auto">
        <button
          className="flex items-center justify-center active:scale-[.90] active:duration-75 transition-all shadow-xs rounded-full px-6 py-2 bg-orange-300 hover:bg-orange-200"
          onClick={handlePublish}
        >
          <p className="font-semibold text-sm lg:text-base tracking-wider">
            Publish
          </p>
        </button>
      </div> */}

      <section>
        <div className="mx-auto w-full">
          <textarea
            placeholder="Blog Title"
            className="text-3xl font-semibold w-full outline-none resize-none placeholder:opacity-40"
            onKeyDown={handleKeyDown}
            onChange={handleTitleChange}
            value={blog.title}
          />
          <hr className="w-full opacity-50 my-6 py-[0.5px] bg-gray-500 " />
          <div id="blogEditor" className="font-gelasio"></div>
        </div>

        {/* <div className="relative aspect-video bg-white border-4 border-grey">
          <label htmlFor="uploadBanner" className="cursor-pointer">
            {progress ? (
              <Progress
                progress={progress}
                className="flex items-center justify-center h-full min-w-full px-5"
              />
            ) : (
              <img
                src={blog.banner || "imgs/blog banner.png"}
                alt="blog banner image"
                className="z-20 hover:opacity-60"
              />
            )}

            <input
              type="file"
              id="uploadBanner"
              accept=".png,.jpg,.jpeg"
              hidden
              disabled={progress}
              onChange={handleBannerUpload}
            />
          </label>
        </div> */}
      </section>
    </div>
  );
};

export default BlogEditor;
