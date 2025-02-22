import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BlogEditor from "../components/blog/BlogEditor.jsx";
import PublishForm from "../components/blog/PublishForm.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

import NavBar from "../components/navbar/NavBar";
import SideBar from "../components/sidebar/SideBar";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
};

const Editor = () => {
  useEffect(() => {
    document.title = "Edit Page";
  });

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = (isOpen) => {
    setIsSideBarOpen(isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar && !sidebar.contains(event.target) && isSideBarOpen) {
        toggleSideBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideBarOpen]);

  const { user } = useAuthContext();
  const [editorState, setEditorState] = useState("editor");
  const [blogEditor, setBlogEditor] = useState({ isReady: false });
  const [blogDetail, setBlogDetail] = useState(blogStructure);
  return (
    <div className="flex flex-col items-center min-w-full min-h-screen w-full">
      <NavBar toggleSideBar={() => toggleSideBar(!isSideBarOpen)} />
      {isSideBarOpen && <SideBar toggleSideBar={toggleSideBar} />}

      <div className="bg-red-200// mt-4 ">
        {editorState === "editor" ? (
          <BlogEditor
            blog={blogDetail}
            setBlog={setBlogDetail}
            blogEditor={blogEditor}
            setBlogEditor={setBlogEditor}
            setEditorState={setEditorState}
          />
        ) : (
          <PublishForm
            blog={blogDetail}
            setBlog={setBlogDetail}
            setEditorState={setEditorState}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
