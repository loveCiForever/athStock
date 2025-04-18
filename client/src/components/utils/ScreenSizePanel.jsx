import React, { useState, useEffect } from "react";

const ScreenSizePanel = ({ position }) => {
  const [screenSize, setScreenSize] = useState(getCurrentBreakpoint());
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < 640) return "XS"; // Extra small
    if (width < 768) return "SM"; // Small
    if (width < 1024) return "MD"; // Medium
    if (width < 1280) return "LG"; // Large
    return "xl"; // Extra large
  }

  function getPositionStyle() {
    switch (position) {
      case "top-left":
        return { top: "0", left: "0" };
      case "top-right":
        return { top: "0", right: "0" };
      case "bottom-left":
        return { bottom: "0", left: "0" };
      case "bottom-right":
        return { bottom: "0", right: "0" };
      default:
        return { top: "0", left: "0" };
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getCurrentBreakpoint());
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={getPositionStyle()}
      className="fixed p-4 bg-gray-800 text-white z-50"
    >
      <h2 className="text-lg font-bold">Current Screen Size</h2>
      <p className="text-xl">{screenSize}</p>
      <p className="text-sm">Width: {windowDimensions.width}px</p>
      <p className="text-sm">Height: {windowDimensions.height}px</p>
    </div>
  );
};

export default ScreenSizePanel;
