// application/client/src/utils/formatNumber.jsx

/**
 * Formats a number with Vietnamese units (nghìn, triệu, tỷ, nghìn tỷ)
 * @param {number}
 * @returns {string}
 * @throws {Error}
 */
export const formatNumber = (value) => {
  try {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("Invalid number");
    }

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
  } catch (error) {
    throw new Error(`Invalid number format: ${error.message}`);
  }
};
