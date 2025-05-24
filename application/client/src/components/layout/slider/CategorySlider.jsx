// CategorySlider.jsx

import React, { useRef, useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeContext } from "../../../hooks/useTheme";
export default function CategorySlider({
  categories,
  selectedCategory,
  handleCategoryClick,
}) {
  const sliderRef = useRef(null);
  const scrollAmount = 200;
  const { theme } = useContext(ThemeContext);

  const scrollPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full px-5">
      {/* Left arrow */}
      <button
        onClick={scrollPrev}
        className={`
          absolute -left-5 top-1/2 transform -translate-y-1/2 z-10
          p-2 rounded-full
          border-gray-300 border-2  active:scale-[.90] active:duration-90 transition-all
          ${theme === "dark-theme" ? "" : "hover:bg-gray-300"}
        `}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Scrollable list */}
      <div
        ref={sliderRef}
        className="
          category-list flex flex-row w-full py-4 px-3 gap-x-3
          bg-gray-100// rounded-lg overflow-x-auto no-scrollbar
          cursor-grab active:cursor-grabbing items-center justify-between
        "
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`
              py-2 px-5 flex-shrink-0 text-sm font-normal xl:font-semibold rounded-full
               text-white hover:bg-black/50 ${
                 theme === "dark-theme" ? "bg-black/30" : "bg-black/80"
               }
              ${
                selectedCategory === cat &&
                "bg-orange-500 hover:bg-orange-500 p-2 border-orange-500"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={scrollNext}
        className={`
          absolute -right-5 top-1/2 transform -translate-y-1/2 z-10
          p-2 rounded-full
          border-gray-300 border-2  active:scale-[.90] active:duration-90 transition-all 
          ${theme === "dark-theme" ? "" : "hover:bg-gray-300"}
        `}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
