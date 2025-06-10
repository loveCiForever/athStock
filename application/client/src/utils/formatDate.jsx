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
 * Formats date in Vietnamese format with relative time for today's posts
 * @param {string|number|Date} timestamp - ISO string, Unix timestamp, or Date object
 * @returns {string} Formatted date string in Vietnamese
 * @throws {Error} If timestamp is invalid
 * @example
 * getDayMonthYear("2025-06-06T05:52:41.454Z") // "2 giờ trước"
 * getDayMonthYear("2025-05-06T05:52:41.454Z") // "6 Tháng 5 2025"
 */
export const getDayMonthYear = (timestamp) => {
  try {
    const realTimestamp = toMilliseconds(timestamp);
    const date = new Date(realTimestamp);
    const now = new Date();

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      const diffInMilliseconds = now - date;
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);

      if (diffInMinutes < 1) return "Vừa xong";
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
      if (diffInHours < 24) return `${diffInHours} giờ trước`;
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

export const isWeekend = (dayIndex) => {
  return dayIndex === 0 || dayIndex === 6;
};

/**
 * Check if market is open at given date (9:00-15:00, weekdays only)
 * @param {Date} date - Date to check
 * @returns {boolean} True if market is open
 */
export const isOpen = (date) => {
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentTime = hours * 60 + minutes;

  if (isWeekend(day)) return false;

  return currentTime >= 540 && currentTime < 900;
};

export const parseTradingDate = (str) => {
  const [day, month, year] = str.split("/");
  return new Date(+year, +month - 1, +day).getTime();
};
