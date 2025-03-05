// .client/src/components/blog/BlogEditor.jsx

import React, { useEffect, useRef, useState, useContext } from "react";
import { toast } from "react-toastify";
import { tools } from "./Tools.jsx";
import EditorJS from "@editorjs/editorjs";
import axios from "axios";
import { EditorContext } from "../../pages/EditorPage.jsx";
import { UserContext } from "../../App.jsx";

const BlogEditor = ({ theme }) => {
  const textRef = useRef();
  const {
    blog,
    blog: { title, content },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  const { userAuth } = useContext(UserContext);
  const access_token = userAuth?.access_token;

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleClearAll = () => {
    if (textEditor.isReady) {
      textEditor.clear();
    }

    if (textRef.current) {
      textRef.current.value = "";
    }

    setBlog({ ...blog, title: "", content: {} });
  };

  const handlePublish = () => {
    if (!title.length) {
      return toast.error("You must enter the title for your blog");
    }

    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            const blogObj = {
              title,
              content: data,
            };

            // axios
            //   .post(
            //     `${import.meta.env.VITE_SERVER_DOMAIN}${
            //       import.meta.env.VITE_SERVER_PORT
            //     }/create-blog`,
            //     blogObj,
            //     {
            //       headers: {
            //         Authorization: `Bearer ${access_token}`,
            //       },
            //     }
            //   )
            //   .then(() => {
            //     toast.success("Blog published successfully!");
            //     handleClearAll();
            //     setEditorState("editor");
            //   })
            //   .catch((error) => {
            //     console.error("Error publishing blog:", error);
            //     toast.error("Failed to publish blog. Please try again.");
            //   });
            console.log(blogObj);
          } else {
            return toast.error("Write something in your blog to publish it");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holder: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
        })
      );
    }
  }, []);

  return (
    <div
      className={`w-[750px] h-auto px-6 py-6 my-10 z-30 rounded-2xl shadow-2xl ${
        theme === "light"
          ? "bg-white text-black border-gray-300"
          : "bg-black/30 text-white"
      }`}
    >
      <nav className="flex w-full items-center justify-end">
        <button
          onClick={handleClearAll}
          className={`rounded-full bg-grey relative px-4 py-1.5 active:scale-[.90] active:duration-75 transition-all ${
            theme === "light"
              ? "hover:bg-lightModeButtonColor"
              : "hover:bg-black/20"
          }`}
        >
          Clear
        </button>
      </nav>
      <div className="w-full h-auto px-10">
        <textarea
          ref={textRef}
          onChange={handleTitleChange}
          defaultValue={title}
          placeholder="Blog Title"
          onKeyDown={handleTitleKeyDown}
          className="text-3xl font-semibold w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-60 bg-transparent"
        ></textarea>

        <section className="w-full h-auto">
          <div id="textEditor" className="h-auto font-gelasio mt-4"></div>
        </section>
      </div>

      <button
        className={`flex items-center justify-center w-full active:scale-[.97] active:duration-75 transition-all shadow-xs rounded-xl px-6 py-2 ${
          theme === "light"
            ? "bg-black text-white hover:bg-lightModeButtonColor"
            : "bg-white text-black hover hover:bg-gray-300"
        }`}
        onClick={handlePublish}
      >
        <p className="font-semibold text-sm lg:text-base tracking-wider">
          Submit
        </p>
      </button>
    </div>
  );
};

export default BlogEditor;
