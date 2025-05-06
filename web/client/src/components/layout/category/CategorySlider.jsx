// athStock/client/src/components/layout/category/CategorySlide.jsx

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategorySlider({
  categories,
  selectedCategory,
  handleCategoryClick,
}) {
  const sliderRef = useRef(null);
  const scrollAmount = 200;

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
    <div className="relative w-full">
      {/* Left arrow */}
      <button
        onClick={scrollPrev}
        className="
          absolute -left-5 top-1/2 transform -translate-y-1/2 z-10
          p-2 bg-white rounded-full
          border-gray-300 border-2
        "
      >
        <ChevronLeft size={20} />
      </button>

      {/* Scrollable list */}
      <div
        ref={sliderRef}
        className="
          category-list flex flex-row w-full py-4 px-8 gap-x-3
          bg-gray-100 rounded-lg overflow-x-auto no-scrollbar
          cursor-grab active:cursor-grabbing
        "
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`
              py-2 px-5 flex-shrink-0 text-sm font-normal xl:font-semibold rounded-full
              bg-black/80 text-white hover:bg-black/50
              ${
                selectedCategory === cat
                  ? "bg-orange-500 hover:bg-orange-500"
                  : ""
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
        className="
          absolute -right-5 top-1/2 transform -translate-y-1/2 z-10
          p-2 bg-white rounded-full
          border-gray-300 border-2
        "
      >
        <ChevronRight size={20} className={``} />
      </button>
    </div>
  );
}
