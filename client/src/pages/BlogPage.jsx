// ./client/src/pages/BlogPage.jsx
import NavBar from "../components/navbar/NavBar";
import { useEffect } from "react";

const BlogPage = ({ theme }) => {
  useEffect(() => {
    document.title = "Blog Page";
  });

  return (
    <div
      className={`flex flex-col items-center min-w-full min-h-screen ${
        theme == "light" ? "bg-white" : "bg-darkModeBackgroundColor"
      }`}
    >
      <NavBar theme={theme} />
      <div className="flex justify-between w-full px-40 mt-10">
        {/* The latest blog */}
        <div className=""></div>

        {/* Trending blog */}
        <div className=""></div>
      </div>
    </div>
  );
};

export default BlogPage;
