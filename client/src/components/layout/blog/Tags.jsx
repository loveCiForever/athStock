import { useContext } from "react";
import { EditorContext } from "../../../pages/EditorPage.jsx";

const Tag = ({ tag, tagIndex }) => {
  let {
    blog,
    blog: { tags },
    setBlog,
  } = useContext(EditorContext);

  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };

  const handleTagEdit = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      let currentTag = e.target.innerText;

      tags[tagIndex] = currentTag;

      setBlog({ ...blog, tags });

      e.target.setAttribute("contentEditable", false);
    }
  };

  const handleTagDelete = () => {
    tags = tags.filter((t) => t != tag);
    setBlog({ ...blog, tags });
  };

  return (
    <div className="inline-block">
      <div className="flex items-center bg-red-200 rounded-xl mt-2 mr-2">
        <p
          className="bg-gray-200 rounded-l-xl py-[1.5px] px-4 cursor-pointer"
          onKeyDown={handleTagEdit}
          onClick={addEditable}
        >
          {tag}
        </p>
        <button
          className="bg-gray-200 rounded-r-xl py-[1.5px] px-2 hover:bg-gray-300"
          onClick={handleTagDelete}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Tag;
