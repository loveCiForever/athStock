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
 * Gets day and month in Vietnamese format
 * @param {number|string|Date} timestamp - Date input
 * @returns {string} Formatted date (e.g., "15 Tháng 6")
 * @throws {Error} If timestamp is invalid
 */
export const getDay = (timestamp) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) throw new Error("Invalid date");
    return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  } catch (error) {
    throw new Error(`Invalid date format: ${error.message}`);
  }
};

/**
 * Gets full date in Vietnamese format
 * @param {number|string|Date} timestamp - Date input
 * @returns {string} Formatted date (e.g., "15 Tháng 6 2025")
 * @throws {Error} If timestamp is invalid
 */
export const getFullDay = (timestamp) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) throw new Error("Invalid date");
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  } catch (error) {
    throw new Error(`Invalid date format: ${error.message}`);
  }
};

/**
 * Formats date in DD/MM/YYYY format
 * @param {Date} date - Date object
 * @returns {string} Formatted date (e.g., "15/06/2025")
 * @throws {Error} If date is invalid
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
