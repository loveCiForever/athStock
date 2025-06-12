// ./application/client/src/utils/getColor.jsx

export const getTextStockColor = (type, theme) => {
  const colors = {
    up: {
      dark: "text-[#0bdf39]", // light green
      light: "text-[#02b428]", // dark green
    },
    down: {
      dark: "text-[#ff0d0d]", // light red
      light: "text-[#ff0000]", // dark red
    },
    nochange: {
      dark: "text-[#fbff00]", // light yellow
      light: "text-[#a79b00]", // dark yellow
    },
    ceiling: {
      dark: "text-[#fd02fd]", // light purple
      light: "text-[#fd02fd]", // dark purple
    },
    floor: {
      dark: "text-[#52d3f9]", // light blue
      light: "text-[#00c3ff]", // dark blue
    },
  };

  if (!type || !colors[type]) {
    throw new Error("Invalid type. Try up, down, nochange, ceiling, floor");
  }

  return theme === "dark-theme" ? colors[type].dark : colors[type].light;
};
