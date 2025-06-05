// application/client/src/components/layout/slider/CategorySlider.jsx

import React, { useRef, useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { ThemeContext } from "../../../hooks/useTheme";

export default function CategorySlider({
  categories,
  selectedCategory,
  handleCategoryClick,
}) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const { theme } = useContext(ThemeContext);

  const scrollAmount = 200;

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollPrev = () => {
    if (sliderRef.current && canScrollLeft) {
      setIsScrolling(true);
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  const scrollNext = () => {
    if (sliderRef.current && canScrollRight) {
      setIsScrolling(true);
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      checkScrollPosition();
      slider.addEventListener("scroll", checkScrollPosition);
      return () => slider.removeEventListener("scroll", checkScrollPosition);
    }
  }, [categories]);

  const handleKeyDown = (event, category) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCategoryClick(category);
    }
  };

  return (
    <div className="relative w-full group">
      <button
        onClick={scrollPrev}
        disabled={!canScrollLeft}
        aria-label="Scroll categories left"
        className={`
          absolute left-2 top-1/2 transform -translate-y-1/2 z-20
          w-10 h-10 rounded-full shadow-xl backdrop-blur-2xl
          transition-all duration-300 ease-out
          ${
            canScrollLeft
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none"
          }
          ${
            theme === "dark-theme"
              ? "bg-gray-800/90 hover:bg-gray-700/90 border-gray-600/50"
              : "bg-white/90 hover:bg-gray-50/90 border-gray-200/50"
          }
          border backdrop-blur-md
          focus:outline-none focus:ring-2 focus:ring-orange-500/50
          hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <ChevronLeft
          size={18}
          className={`mx-auto transition-colors ${
            theme === "dark-theme" ? "text-gray-200" : "text-gray-600"
          }`}
        />
      </button>

      <div className="relative overflow-hidden rounded-md">
        <div
          className={`
          absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none
          ${canScrollLeft ? "opacity-100" : "opacity-0"}
          ${
            theme === "dark-theme"
              ? "bg-gradient-to-r from-zinc-900/90 to-transparent"
              : "bg-gradient-to-r from-gray-100 to-transparent"
          }
          transition-opacity duration-300
        `}
        />

        <div
          className={`
          absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none
          ${canScrollRight ? "opacity-100" : "opacity-0"}
          ${
            theme === "dark-theme"
              ? "bg-gradient-to-l from-zinc-900/90 to-transparent"
              : "bg-gradient-to-l from-gray-100 to-transparent"
          }
          transition-opacity duration-300
        `}
        />

        <div
          ref={sliderRef}
          className={`
            flex items-center gap-3 px-6 py-4 overflow-x-auto no-scrollbar
            ${theme === "dark-theme" ? "bg-zinc-900/50//" : "bg-gray-50/50//"}
            transition-all duration-300 scroll-smooth
            ${isScrolling ? "cursor-grabbing" : "cursor-grab"}
          `}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={`${cat}-${index}`}
                onClick={() => handleCategoryClick(cat)}
                onKeyDown={(e) => handleKeyDown(e, cat)}
                aria-pressed={isSelected}
                className={`
                  relative flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium
                  transition-all duration-300 ease-out
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  transform hover:scale-105 active:scale-95
                  ${
                    isSelected
                      ? `
                      bg-gradient-to-r from-orange-500 to-orange-600 text-white
                      shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                      focus:ring-orange-500/50 border-2 border-orange-400/50
                    `
                      : theme === "dark-theme"
                      ? `
                      bg-gray-700/20 text-gray-200 hover:bg-gray-600/80
                      border border-gray-600/50 hover:border-gray-500/50
                      focus:ring-gray-500/50 hover:shadow-md
                    `
                      : `
                      bg-white/80// text-gray-900 hover:bg-orange-300
                      border border-gray-200/80 hover:border-gray-300
                      focus:ring-gray-400/10 hover:shadow-md
                    `
                  }
                `}
              >
                {isSelected && (
                  <Circle
                    size={6}
                    className="absolute -top-1 -right-1 fill-white text-white animate-pulse"
                  />
                )}

                <span className="relative z-10">{cat}</span>

                <div
                  className={`
                  absolute inset-0 rounded-full opacity-0 transition-opacity duration-300
                  ${
                    isSelected
                      ? "bg-white/10 hover:opacity-100"
                      : "bg-orange-500// hover:opacity-100"
                  }
                `}
                />
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={scrollNext}
        disabled={!canScrollRight}
        aria-label="Scroll categories right"
        className={`
          absolute right-2 top-1/2 transform -translate-y-1/2 z-20
          w-10 h-10 rounded-full shadow-xl backdrop-blur-2xl
          transition-all duration-300 ease-out
          ${
            canScrollRight
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-2 pointer-events-none"
          }
          ${
            theme === "dark-theme"
              ? "bg-gray-800/90 hover:bg-gray-700/90 border-gray-600/50"
              : "bg-white/90 hover:bg-gray-50/90 border-gray-200/50"
          }
          border backdrop-blur-md
          focus:outline-none focus:ring-2 focus:ring-orange-500/50
          hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <ChevronRight
          size={18}
          className={`mx-auto transition-colors ${
            theme === "dark-theme" ? "text-gray-200" : "text-gray-600"
          }`}
        />
      </button>

      <div
        className={`
        absolute bottom-0 left-6 right-6 h-0.5 rounded-full overflow-hidden
        ${theme === "dark-theme" ? "bg-gray-700/50" : "bg-gray-200/50"}
        transition-opacity duration-300
        ${categories.length > 5 ? "opacity-100" : "opacity-0"}
      `}
      >
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(
              100,
              ((sliderRef.current?.clientWidth || 0) /
                (sliderRef.current?.scrollWidth || 1)) *
                100
            )}%`,
            transform: `translateX(${
              ((sliderRef.current?.scrollLeft || 0) /
                ((sliderRef.current?.scrollWidth || 1) -
                  (sliderRef.current?.clientWidth || 0))) *
              100
            }%)`,
          }}
        />
      </div>
    </div>
  );
}
