import React from "react";

const Tag = ({ tag, setBlog, i }) => {
  const handleDelete = () => {
    setBlog((prev) => {
      const filteredTags = prev.tags.filter((t) => t !== tag);
      return { ...prev, tags: filteredTags };
    });
  };
  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      setBlog((prev) => {
        let tags = prev.tags;
        tags[i] = e.target.innerText;
        return { ...prev, tags };
      });
      e.target.setAttribute("contentEditable", false);
    }
  };
  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };
  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <p
        className="outline-none"
        onKeyDown={handleKeyDown}
        onClick={addEditable}
      >
        {tag}
      </p>
      <button
        className="rounded-full absolute mt-[2px] right-1 top-1/2 -translate-y-1/2 hover:bg-red/20 flex items-center justify-center w-8 h-8 opacity-40 hover:opacity-100"
        onClick={handleDelete}
      >
        <i className="fi fi-br-cross text-[10px] pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
