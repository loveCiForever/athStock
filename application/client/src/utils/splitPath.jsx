// application/client/src/utils/splitPath.jsx

/*
 * Extracts the base path from a URL or path string
 * @param {string} path - The URL or path to process
 * @returns {string} The base path segment
 */
export const getBasePath = (path) => {
  if (!path) return "";

  try {
    // Remove leading and trailing slashes
    const cleanPath = path.replace(/^\/+|\/+$/g, "");

    // Split path and get first segment
    const segments = cleanPath.split("/");

    // For full URLs, find the first path segment after the domain
    if (path.startsWith("http")) {
      const url = new URL(path);
      return url.pathname.split("/")[1] || "";
    }

    return segments[0] || "";
  } catch (error) {
    console.error("Error parsing path:", error);
    return "";
  }
};
