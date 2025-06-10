export const CACHE_KEY_PREFIX = "stock_cache_";

export const getCacheKey = (indexId) => {
  const today = new Date().toISOString().split("T")[0];
  return `${CACHE_KEY_PREFIX}${indexId}_${today}`;
};

export const getStockCache = (indexId) => {
  const cacheKey = getCacheKey(indexId);
  const cachedData = localStorage.getItem(cacheKey);
  return cachedData ? JSON.parse(cachedData) : null;
};

export const setStockCache = (indexId, data) => {
  const cacheKey = getCacheKey(indexId);
  localStorage.setItem(cacheKey, JSON.stringify(data));
};
