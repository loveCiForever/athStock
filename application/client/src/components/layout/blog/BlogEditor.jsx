// ./client/src/components/blog/BlogEditor.jsx

import React, { useEffect, useRef, useState, useContext } from "react";
import { toast } from "react-toastify";
import { tools } from "./EditorTool.jsx";
import EditorJS from "@editorjs/editorjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EditorContext } from "../../../pages/BlogEditorPage.jsx";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";
import categories from "../../../utils/CategoryList.jsx";
import { X } from "lucide-react";

import { ThemeContext } from "../../../hooks/useTheme.jsx";

const BlogEditor = () => {
  const textRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user, getAccessToken } = useAuthContext();
  const [bannerUrl, setBannerUrl] = useState("");
  const access_token = getAccessToken();
  const navigate = useNavigate();
  const VITE_BASE_URL =
    import.meta.env.VITE_IP + ":" + import.meta.env.VITE_SERVER_PORT;
  const { theme } = useContext(ThemeContext);

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

            // console.log(blogObj);

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
      className={`w-[1000px] min-h-40 py-10 rounded-md ${
        theme === "dark-theme" ? " " : "bg-white text-black"
      }`}
    >
      {/* <nav className="flex items-center justify-end py-6">
        <button className="p-1 mr-6 rounded-full bg-white" onClick={handleExit}>
          <X />
        </button>
      </nav> */}

      <div className="w-full px-16 mt-10 flex justify-start items-center">
        <div className="w-full">
          <textarea
            ref={textRef}
            onChange={handleTitleChange}
            value={title}
            placeholder="Blog Title"
            onKeyDown={handleTitleKeyDown}
            className="
                w-full
                h-auto
                pl-3
                text-3xl
                font-bold
                leading-tight
                outline-none
                resize-none
                placeholder:opacity-80
                text-black
                text-start
            "
            style={{ textAlignLast: "start" }}
          />

          <textarea
            ref={textRef}
            onChange={handleIntroChange}
            value={intro}
            placeholder="Introduction"
            onKeyDown={handleIntroKeyDown}
            className="w-full h-10 pl-3 mt-3 text-lg font-semibold leading-normal bg-transparent outline-none resize-none placeholder:opacity-60"
          ></textarea>

          <section className="w-full justify-start h-auto bg-red-200">
            <div
              id="textEditor"
              className="flex flex-col justify-start h-auto mt-3 font-gelasio "
            />
          </section>
        </div>

        {/* <input
          type="text"
          name="bannerlink"
          id="bannerlink"
          placeholder="Enter you banner's url"
          value={bannerUrl}
          onChange={handleBannerUrl}
          className="w-full p-2 pl-3 mb-5 bg-white border rounded-md outline-none"
        />
        <div className="mb-5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 pl-3 bg-white border rounded-md outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div> */}

        {/* <div className="flex items-center justify-center gap-4">
          <button
            className={`flex items-center justify-center w-1/4 active:scale-[.97] active:duration-75 transition-all shadow-xs rounded-lg py-2 ${
              theme === "light"
                ? "bg-black text-white hover:bg-orange-500"
                : "bg-white text-black hover hover:bg-gray-300"
            }`}
            onClick={handleClearAll}
          >
            <p className="text-sm font-semibold tracking-wider lg:text-base">
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
            <p className="text-sm font-semibold tracking-wider lg:text-base">
              Publish
            </p>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default BlogEditor;
