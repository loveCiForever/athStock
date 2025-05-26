const formatNumber = (value) => {
  const units = [
    { limit: 1e12, suffix: "nghìn tỷ" },
    { limit: 1e9, suffix: "tỷ" },
    { limit: 1e6, suffix: "triệu" },
    { limit: 1e3, suffix: "nghìn" },
  ];

  for (const { limit, suffix } of units) {
    if (value >= limit) {
      const num = value / limit;
      const formatted = num.toLocaleString("en-VN", {
        maximumFractionDigits: 3,
        minimumFractionDigits: 0,
      });
      return `${formatted} ${suffix}`;
    }
  }

  return value.toLocaleString("vi-VN");
};

export { formatNumber };
