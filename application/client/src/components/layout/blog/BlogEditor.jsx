// application/client/src/components/blog/BlogEditor.jsx

import React, { useEffect, useRef, useState, useContext } from "react";
import { toast } from "react-toastify";
import { tools } from "./EditorTool.jsx";
import EditorJS from "@editorjs/editorjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/AuthContext.jsx";
import categories from "../../../utils/CategoryList.jsx";
import { X } from "lucide-react";
import { BlogStructure } from "./BlogStructure.jsx";
import { ThemeContext } from "../../../hooks/useTheme.jsx";
import { EditorContext } from "../../../pages/SingleBlogPage.jsx";
const BlogEditor = () => {
  const textRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const {
    blog,
    blog: { title, intro, content, tags },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  const { user, getAccessToken } = useAuthContext();
  const access_token = getAccessToken();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const VITE_BASE_URL =
    import.meta.env.VITE_IP + ":" + import.meta.env.VITE_SERVER_PORT;
  const tagLimit = 10;

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

  const handleIntroChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, intro: input.value });
  };

  const handleTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      let tag = e.target.value.trim().toLowerCase();

      if (tag.length && !tags.includes(tag)) {
        if (tags.length < tagLimit) {
          setBlog({ ...blog, tags: [...tags, tag] });
          e.target.value = "";
        } else {
          toast.error(`Bạn chỉ có thể thêm tối đa ${tagLimit} tags`);
        }
      }
    }
  };

  const handleClearAll = () => {
    if (textEditor.isReady) {
      textEditor.clear();
    }
    setBlog({
      ...BlogStructure,
      content: {},
      tags: [],
    });
    setSelectedCategory("");
    setBannerUrl("");
  };

  const handlePublish = async () => {
    if (!title.length) {
      return toast.error("You must enter the title for your blog");
    }

    if (!textEditor || !textEditor.isReady) {
      return toast.error("Editor is not ready");
    }

    try {
      const data = await textEditor.save();

      if (!data.blocks.length) {
        return toast.error("Write something in your blog to publish it");
      }

      const blogObj = {
        ...blog,
        title,
        intro,
        content: data,
        tags,
        category: selectedCategory,
        banner: bannerUrl,
      };

      await axios.post(`${VITE_BASE_URL}/api/blog/create-blog`, blogObj, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      toast.success("Blog published successfully!");
      navigate("/blog");
    } catch (error) {
      console.error(
        "Error publishing blog:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to publish blog. Please try again.");
    }
  };

  useEffect(() => {
    const titleInput = document.querySelector(".auto-resize-title");
    if (titleInput) {
      titleInput.style.height = "auto";
      titleInput.style.height = titleInput.scrollHeight + "px";
    }
  }, [title]);

  useEffect(() => {
    if (!textRef.current) return;

    const initEditor = async () => {
      const editor = new EditorJS({
        holder: textRef.current,
        tools: tools,
        placeholder: "Bắt đầu viết bài...",
        minHeight: 100,
        autofocus: true,
        // Remove defaultBlock to prevent double lines
        defaultBlock: "paragraph",
        preserveBlank: false,
        onChange: () => {
          console.log("Editor content changed");
        },
      });

      try {
        await editor.isReady;
        setTextEditor(editor);
        console.log("Editor.js is ready to work!");
      } catch (error) {
        console.error("Editor.js initialization failed:", error);
      }
    };

    initEditor();

    return () => {
      const destroyEditor = async () => {
        if (textEditor && textEditor.destroy) {
          try {
            await textEditor.destroy();
          } catch (err) {
            console.error("Failed to destroy editor:", err);
          }
        }
      };

      destroyEditor();
    };
  }, []);

  return (
    <div
      className={`blog-page w-full max-w-6xl mb-20 mx-auto border-[1px]// ${
        theme === "dark-theme"
          ? "bg-gray-800//"
          : "bg-white// border-gray-200//"
      } rounded-lg shadow-xl// `}
    >
      <div className="p-10">
        <>
          <textarea
            placeholder="Blog Title"
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            value={title}
            rows={1}
            className="auto-resize-title w-full text-3xl font-bold mb-4 p-4 bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none resize-none overflow-hidden"
          />

          <textarea
            placeholder="Write a brief introduction..."
            onChange={handleIntroChange}
            value={intro}
            className="w-full px-4 min-h-[50px] bg-transparent border// border-gray-300// rounded resize-none focus:border-orange-500 outline-none"
          />

          <div
            ref={textRef}
            className="min-h-[400px] border// border-gray-300 rounded-lg px-4 mb-6"
            id="textEditor"
          />
        </>

        <div className="flex w-full items-start justify-start gap-10 mb-4 px-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <h1 className="font-semibold whitespace-nowrap">Phân loại</h1>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded border// border-gray-300// bg-transparent outline-none focus:border-orange-500"
            >
              <option value="">Thể loại bài viết</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <hr className="w-[1px] h-8 bg-black" />

          <div className="flex items-start gap-2">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">Tags</h1>
              <input
                type="text"
                placeholder="Nhấn Enter để thêm tag"
                onKeyDown={handleTag}
                className=" p-2 rounded border/ border-gray-300/ bg-transparent outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 py-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-black/60 text-white"
                >
                  {tag}
                  <button
                    onClick={() => {
                      setBlog({
                        ...blog,
                        tags: tags.filter((_, i) => i !== index),
                      });
                    }}
                    className="hover:text-gray-200"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            onClick={handleClearAll}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-300"
          >
            Clear
          </button>
          <button
            onClick={handlePublish}
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-300"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
