// application/client/src/utils/formatString.jsx

import { checkString } from "./checkString.jsx";

/*
 * Capitalizes the first letter of each word in a string
 * @param {string} fullName - The string to be transformed
 * @returns {string} The transformed string
 */
export const UppercaseFirstLetterEachWord = (fullName) => {
  checkString(fullName);

  return fullName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/*
 * Converts entire string to uppercase
 * @param {string} string - The string to be transformed
 * @returns {string} The uppercase string
 */
export const UppercaseFullString = (string) => {
  checkString(string);

  return string.toUpperCase();
};

/*
 * Truncates text to specified length and adds ellipsis
 * @param {string} string - The string to be truncated
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} The truncated string
 */
export const TruncateText = (string, maxLength) => {
  checkString(string);

  if (!maxLength || typeof maxLength !== "number" || maxLength < 0) {
    return "Invalid maxLength: Please provide a positive number";
  }
  return string.length > maxLength
    ? string.slice(0, maxLength) + "..."
    : string;
};
