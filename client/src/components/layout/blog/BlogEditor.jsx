// ./client/src/components/blog/BlogEditor.jsx

import React, { useEffect, useRef, useState, useContext } from "react";
import { toast } from "react-toastify";
import { tools } from "./EditorTool.jsx";
import EditorJS from "@editorjs/editorjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EditorContext } from "../../../pages/EditorPage.jsx";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";
import categories from "../../../utils/CategoriesList.jsx";
import WhiteCloseIcon from "../../../assets/icons/white/close.svg";
const BlogEditor = ({ theme }) => {
  const textRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user, getAccessToken } = useAuthContext();
  const [bannerUrl, setBannerUrl] = useState("");
  const access_token = getAccessToken();
  const navigate = useNavigate();
  const VITE_BASE_URL =
    import.meta.env.VITE_IP + ":" + import.meta.env.VITE_SERVER_PORT;

  const tagLimit = 10;
  const {
    blog,
    blog: { title, intro, content, tags },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value.trim() });
  };

  const handleBannerUrl = (e) => {
    setBannerUrl(e.target.value);
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleIntroChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, intro: input.value.trim() });
  };

  const handleIntroKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTag = (e) => {
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

    setBlog({ ...blog, title: "", intro: "", content: {}, tag: [] });
    setSelectedCategory("");
  };

  const handleExit = () => {
    navigate("/");
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
              intro,
              content: data,
              tags,
              category: selectedCategory,
              banner: bannerUrl,
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
      className={`w-[800px] h-auto mt-10 pb-10 z-30 border-[0.5px] rounded-xl shadow-xl ${
        theme === "light" ? " text-black" : "bg-black/30 text-white"
      }`}
    >
      <nav className="flex items-center justify-between py-6 border-b-[1px]">
        <div className="flex-grow text-center">
          <h1 className="text-2xl font-bold ml-12">Write your own blog</h1>
        </div>
        <button
          className="bg-black/40 rounded-full p-1 mr-6 hover:bg-black/60"
          onClick={handleExit}
        >
          <img src={WhiteCloseIcon} alt="" />
        </button>
      </nav>

      <div className="w-full px-16 mt-10">
        <div className="w-full">
          <textarea
            ref={textRef}
            onChange={handleTitleChange}
            value={title}
            placeholder="Title (No more than 100 words)"
            onKeyDown={handleTitleKeyDown}
            className="text-3xl font-bold w-full h-10 outline-none resize-none pl-3 leading-tight placeholder:opacity-60 bg-transparent"
          ></textarea>

          <textarea
            ref={textRef}
            onChange={handleIntroChange}
            value={intro}
            placeholder="Introduction (No more than 500 words)"
            onKeyDown={handleIntroKeyDown}
            className="text-lg font-semibold w-full h-10 outline-none resize-none pl-3 mt-3 leading-normal placeholder:opacity-60 bg-transparent"
          ></textarea>

          <section className="w-full h-auto">
            <div id="textEditor" className="h-auto font-gelasio mt-3"></div>
          </section>
        </div>

        {/* <div className="mb-5 flex flex-col w-full border-[1px] rounded-xl p-2">
          <input
            type="text"
            placeholder="Tags"
            className="p-0 w-[40%] rounded-md pl-3 focus:bg-white border-white outline-none"
            onKeyDown={handleTag}
          />
          <div className="w-full bg-red-000 ml-2">
            {tags.map((tag, i) => {
              return <Tag tag={tag} tagIndex={i} key={i} />;
            })}
          </div>
        </div> */}

        <input
          type="text"
          name="bannerlink"
          id="bannerlink"
          placeholder="Enter you banner's url"
          value={bannerUrl}
          onChange={handleBannerUrl}
          className="p-2 pl-3 w-full rounded-md border bg-white outline-none mb-5"
        />
        <div className="mb-5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 pl-3 w-full rounded-md border bg-white outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            className={`flex items-center justify-center w-1/4 active:scale-[.97] active:duration-75 transition-all shadow-xs rounded-lg py-2 ${
              theme === "light"
                ? "bg-black text-white hover:bg-orange-500"
                : "bg-white text-black hover hover:bg-gray-300"
            }`}
            onClick={handleClearAll}
          >
            <p className="font-semibold text-sm lg:text-base tracking-wider">
              Clear
            </p>
          </button>
          <button
            className={`flex items-center justify-center flex-1 active:scale-[.97] active:duration-75 transition-all shadow-xs rounded-lg py-2 ${
              theme === "light"
                ? "bg-black text-white hover:bg-green-500"
                : "bg-white text-black hover hover:bg-gray-300"
            }`}
            onClick={handlePublish}
          >
            <p className="font-semibold text-sm lg:text-base tracking-wider">
              Publish
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
