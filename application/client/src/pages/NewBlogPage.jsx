// application/client/src/page/NewBlogPage.jsx

import axios from "axios";
import { createContext, useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { BlogStructure } from "../components/layout/blog/BlogStructure";
import PublishBlog from "../components/layout/blog/BlogEditor";
import Footer from "../components/layout/footer/Footer";
import Header from "../components/layout/header/Header";
import { useAuthContext } from "../hooks/AuthContext";
import { ThemeContext } from "../hooks/useTheme";
import { Link } from "react-router-dom";

export const EditorContext = createContext({});

const NewBlogPage = () => {
  useEffect(() => {
    document.title = "New blog";
  });
  const [blog, setBlog] = useState(BlogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });

  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const { user } = useAuthContext();

  if (location.pathname === "/blog/new") {
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">
            Please login to create a blog
          </h1>
          <Link
            to="/login"
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Login
          </Link>
        </div>
      );
    }

    return (
      <div
        className={`single-blog-page ${theme} flex flex-col items-center min-h-screen bg-bg-primary text-text-primary `}
      >
        <Header />
        <main className="flex-1 w-full mx-auto px-6 sm:px-10 md:px-14 xl:px-80 mt-20">
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
            <PublishBlog />
          </EditorContext.Provider>
        </main>
        <Footer />
      </div>
    );
  }
};

export default NewBlogPage;
