// ./client/src/components/blog/BlogEditor.jsx

import React, { useEffect, useRef, useState, useContext } from "react";
import { toast } from "react-toastify";
import { tools } from "./Tools.jsx";
import EditorJS from "@editorjs/editorjs";
import axios from "axios";
import { EditorContext } from "../../pages/EditorPage.jsx";
import { UserContext } from "../../App.jsx";
import Tag from "./Tags.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const BlogEditor = ({ theme }) => {
  const textRef = useRef();
  const { user, getAccessToken } = useAuthContext();
  const access_token = getAccessToken();
  const navigate = useNavigate();
  const VITE_BASE_URL =
    import.meta.env.VITE_IP + ":" + import.meta.env.VITE_SERVER_PORT;

  const tagLimit = 10;
  const {
    blog,
    blog: { title, head, content, tags },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  // useState(() => {
  //   console.log("access token: ", accessToken);
  // });

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

  const handleHeadChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, head: input.value });
  };

  const handleHeadKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      let tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add max ${tagLimit} Tags`);
      }

      e.target.value = "";
    }
  };

  const handleClearAll = () => {
    if (textEditor.isReady) {
      textEditor.clear();
    }

    if (textRef.current) {
      textRef.current.value = "";
    }

    setBlog({ ...blog, title: "", head: "", content: {}, tag: [] });
  };

  const handlePublish = () => {
    // console.log(access_token);
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
              head,
              content: data,
              tags,
            };

            console.log(blogObj);

            axios
              .post(`${VITE_BASE_URL}/api/blog/create-blog`, blogObj, {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              })
              .then(() => {
                toast.success("Blog published successfully!");
                navigate("/blog");
                setEditorState("editor");
              })
              .catch((error) => {
                console.error(
                  "Error publishing blog:",
                  error.response ? error.response.data : error.message
                );
                toast.error("Failed to publish blog. Please try again.");
              });
            // console.log(blogObj);
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
      className={`w-[800px] h-auto py-6 px-16 my-10 z-30 border-[0.5px] rounded-xl shadow-xl ${
        theme === "light" ? " text-black" : "bg-black/30 text-white"
      }`}
    >
      <nav className="flex w-full items-center justify-end">
        <button
          onClick={handleClearAll}
          className={`rounded-full m-2 font-bold bg-grey relative active:scale-[.90] active:duration-75 transition-all ${
            theme === "light" ? "hover:text-orange-500" : "hover:bg-black/20"
          }`}
        >
          Clear
        </button>
      </nav>

      <div className="w-full h-auto">
        <textarea
          ref={textRef}
          onChange={handleTitleChange}
          defaultValue={title}
          placeholder="Blog Title"
          onKeyDown={handleTitleKeyDown}
          className="text-3xl font-semibold w-full h-10 outline-none resize-none pl-3 leading-tight placeholder:opacity-60 bg-transparent"
        ></textarea>

        <textarea
          ref={textRef}
          onChange={handleHeadChange}
          defaultValue={head}
          placeholder="Heading"
          onKeyDown={handleHeadKeyDown}
          className="text-xl font-bold w-full h-10 outline-none resize-none pl-3 mt-3 leading-tight placeholder:opacity-60 bg-transparent"
        ></textarea>

        <section className="w-full h-auto">
          <div id="textEditor" className="h-auto font-gelasio mt-4"></div>
        </section>
      </div>

      <div className="mb-5 flex flex-col w-full border-[1px] rounded-xl p-2">
        <input
          type="text"
          placeholder="Enter your blog's tag"
          className="sticky p-2 w-[40%] rounded-md pl-3 focus:bg-white border-white outline-none"
          onKeyDown={handleKeyDown}
        />
        <div className="w-full bg-red-000 ml-2">
          {tags.map((tag, i) => {
            return <Tag tag={tag} tagIndex={i} key={i} />;
          })}
        </div>
      </div>

      <button
        className={`flex items-center justify-center w-full active:scale-[.97] active:duration-75 transition-all shadow-xs rounded-xl py-2 ${
          theme === "light"
            ? "bg-black text-white hover:bg-orange-500"
            : "bg-white text-black hover hover:bg-gray-300"
        }`}
        onClick={handlePublish}
      >
        <p className="font-semibold text-sm lg:text-base tracking-wider">
          Publish
        </p>
      </button>
    </div>
  );
};

export default BlogEditor;
