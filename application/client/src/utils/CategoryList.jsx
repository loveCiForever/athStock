const defaultCategories = [
  "Nhận định thị trường",
  // "Phân tích kỹ thuật",
  // "Giao dịch nội bộ",
  "Nhân vật",
  // "Cổ phiếu",
  "Ý kiến chuyên gia",
  // "Chứng khoán thế giới",
  "Chính sách",
  "Câu chuyện đầu tư",
  "Tiêu dùng và đời sống",
  // "ETF và các quỹ",
  // "Trái phiếu doanh nghiệp",
  // "Tiền kỹ thuật số",
  "Hoạt động kinh doanh",
  "Niêm yết",
  "Doanh nhân và khởi nghiệp",
  // "Kinh tế thế giới",
  // "Vàng và kim loại quý",
  // "Quy hoạch và hạ tầng",
  // "Kinh tế và đầu tư",
  // "Ngân hàng",
  "Chứng khoán",
  "Crypto và tiền điện tử",
  "Tài chính",
  "Thị trường thế giới",
  "Vàng và kim loại quý",
];

export const sortVietnamese = (a, b) => {
  return a.localeCompare(b, "vi", { sensitivity: "base" });
};

export const getCategories = () => {
  // Get categories from localStorage or use default
  const storedCategories = localStorage.getItem("blogCategories");
  const categories = storedCategories
    ? JSON.parse(storedCategories)
    : defaultCategories;
  return categories.sort(sortVietnamese);
};

export const updateCategories = (newCategories) => {
  // Validate input
  if (!Array.isArray(newCategories)) {
    throw new Error("Categories must be an array of strings");
  }

  // Remove duplicates and empty strings
  const validCategories = [...new Set(newCategories)].filter(
    (cat) => typeof cat === "string" && cat.trim() !== ""
  );

  // Sort and save
  const sortedCategories = validCategories.sort(sortVietnamese);
  localStorage.setItem("blogCategories", JSON.stringify(sortedCategories));
  return sortedCategories;
};

export const addCategory = (newCategory) => {
  if (typeof newCategory !== "string" || newCategory.trim() === "") {
    throw new Error("Category must be a non-empty string");
  }

  const currentCategories = getCategories();
  if (currentCategories.includes(newCategory)) {
    return currentCategories; // No duplicate categories
  }

  const updatedCategories = [...currentCategories, newCategory];
  return updateCategories(updatedCategories);
};

export const removeCategory = (categoryToRemove) => {
  const currentCategories = getCategories();
  const updatedCategories = currentCategories.filter(
    (cat) => cat !== categoryToRemove
  );
  return updateCategories(updatedCategories);
};

export default getCategories();
