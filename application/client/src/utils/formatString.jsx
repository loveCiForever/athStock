// ./application/client/src/utils/formatString.jsx

/**
 * Capitalizes the first letter of each word in a string
 * @param {string}
 * @returns {string}
 */
export const UppercaseFirstLetterEachWord = (string) => {
  try {
    checkStringTr(string);

    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } catch (error) {
    throw new Error(`Invalid string format: ${error.message}`);
  }
};

/**
 * Converts entire string to uppercase
 * @param {string}
 * @returns {string}
 */
export const UppercaseFullString = (string) => {
  try {
    checkStringTr(string);

    return string.toUpperCase();
  } catch (error) {
    throw new Error(`Invalid string format: ${error.message}`);
  }
};

/**
 * Truncates text to specified length and adds ellipsis
 * @param {string}
 * @param {number} maxLength
 * @returns {string}
 */
export const TruncateString = (string, maxLength) => {
  try {
    checkStringTr(string);

    if (!maxLength || typeof maxLength !== "number" || maxLength < 0) {
      throw new Error("Invalid maxLength");
    }
    return string.length > maxLength
      ? string.slice(0, maxLength) + "..."
      : string;
  } catch (error) {
    throw new Error(`Invalid string format: ${error.message}`);
  }
};

/**
 * Extracts the base path from a URL or path string
 * @param {string} path - The URL or path to process
 * @returns {string} The base path segment
 */
export const getBasePath = (path) => {
  if (!path) return "";

  try {
    const cleanPath = path.replace(/^\/+|\/+$/g, "");

    const segments = cleanPath.split("/");

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

export const checkStringTr = (string) => {
  if (!isStringNotNull(string)) {
    throw new Error("String is null");
  } else if (!isString(string)) {
    throw new Error("Value is not string");
  }
  return true;
};

export const checkStringBo = (string) => {
  if (!isStringNotNull(string) || !isString(string)) {
    return false;
  }
  return true;
};

export const isStringNotNull = (string) => {
  return string;
};

export const isString = (string) => {
  return typeof string !== "string" ? false : true;
};
