// application/client/src/utils/formatDate.jsx

/**
 * Vietnamese localization constants
 */
const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const DAYS = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

/**
 * Standardize input into milliseconds
 * @param {number|string|Date}
 * @returns {number|string|Date}
 * @example 1749050069 -> 1749050069000
 */
const toMilliseconds = (timestamp) => {
  if (typeof timestamp === "number" && timestamp < 1e12) {
    return timestamp * 1000;
  }

  return timestamp;
};

/**
 * Get day and month in Vietnamese format (D Tháng M)
 * @param {number|iso-string|Date}
 * @returns {string}
 * @throws {Error}
 * @example "15 Tháng 6"
 */
export const getDayMonth = (timestamp) => {
  try {
    const realTimestamp = toMilliseconds(timestamp);
    const date = new Date(realTimestamp);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  } catch (error) {
    throw new Error(`Invalid date format: ${error.message}`);
  }
};

/**
 * Gets full date in Vietnamese format
 * @param {number|iso-string|Date} timestamp
 * @returns {string
 * @throws {Error}
 * @example "15 Tháng 6 2025"
 */
export const getDayMonthYear = (timestamp) => {
  try {
    const realTimestamp = toMilliseconds(timestamp);
    const date = new Date(realTimestamp);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  } catch (error) {
    throw new Error(`Invalid date format: ${error.message}`);
  }
};

/**
 * Formats date in DD/MM/YYYY format
 * @param {Date} date
 * @returns {string}
 * @throws {Error}
 * @example "15/06/2025"
 */
export const formatDateViEn = (date) => {
  try {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid Date object");
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    throw new Error(`Invalid date format: ${error.message}`);
  }
};
