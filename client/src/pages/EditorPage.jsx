import { useState, useEffect, useContext, createContext } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import BlogEditor from "../components/blog/BlogEditor.jsx";
import NavBar from "../components/navbar/NavBar";
import SideBar from "../components/sidebar/SideBar";
import Loader from "../components/common/Loader.jsx";
import SignInPage from "./SignInPage.jsx";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = ({ theme }) => {
  let { blog_id } = useParams();
  const navigate = useNavigate();

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);

  const { user } = useAuthContext();

  const VITE_BASE_URL =
    import.meta.env.VITE_IP + import.meta.env.VITE_SERVER_PORT;

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

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    axios
      .post(`${VITE_BASE_URL + "/get-blog"}`, {
        blog_id,
        draft: true,
        mode: "edit",
      })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setLoading(false);
      })
      .catch((err) => {
        setBlog(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = "Editor Page";
  });

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {user ? (
        <div
          className={`flex flex-col items-center min-w-full min-h-screen ${
            theme == "light" ? "bg-white" : "bg-black/85"
          }`}
        >
          <NavBar toggleSideBar={() => toggleSideBar(!isSideBarOpen)} />
          {/* {isSideBarOpen && <SideBar toggleSideBar={toggleSideBar} />} */}

          <div className="mt-4 ">{loading ? <Loader /> : <BlogEditor />}</div>
        </div>
      ) : (
        <SignInPage />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
