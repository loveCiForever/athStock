// application/client/src/utils/formatNumber.jsx

import { checkNumber } from "./checkNumber";

/**
 * Formats a number with Vietnamese units (nghìn, triệu, tỷ, nghìn tỷ)
 * @param {number} value - The number to format
 * @returns {string} Formatted number with appropriate unit suffix
 * @throws {Error} If value is not a valid number
 */
export const formatNumber = (value) => {
  checkNumber(value);

  const units = [
    { limit: 1e12, suffix: "nghìn tỷ" },
    { limit: 1e9, suffix: "tỷ" },
    { limit: 1e6, suffix: "triệu" },
    { limit: 1e3, suffix: "nghìn" },
  ];
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  for (const { limit, suffix } of units) {
    if (absValue >= limit) {
      const num = absValue / limit;
      const formatted = num.toLocaleString("vi-VN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
      return `${isNegative ? "-" : ""}${formatted} ${suffix}`;
    }
  }

  return value.toLocaleString("vi-VN");
};
