const SESSION_KEY = "user";
const EXPIRATION_DAYS = 21;

const setSession = (value, key = SESSION_KEY) => {
  if (typeof value === "undefined") {
    console.warn("Attempted to set an undefined value in session.");
    return;
  }

  const now = new Date();
  const lifeTime = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(now.getTime() + lifeTime); // 21 days from now

  const item = {
    value: value,
    expiresAt: expirationDate.toISOString(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error setting session:", error);
  }
};

const getSession = (key = SESSION_KEY) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  let item;
  try {
    item = JSON.parse(itemStr);
  } catch (error) {
    console.error("Error parsing session data:", error);
    localStorage.removeItem(key);
    return null;
  }

  const now = new Date();
  if (new Date(item.expiresAt) < now) {
    // Item has expired
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

const deleteSession = (key = SESSION_KEY) => {
  localStorage.removeItem(key);
};

export { setSession, getSession, deleteSession };
