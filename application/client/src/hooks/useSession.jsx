// ./application/client/src/hooks/useSession.jsx

const SESSION_KEY = "user";
const EXPIRATION_DAYS = 20;

export const setSession = (value, key = SESSION_KEY) => {
  if (typeof value === "undefined") {
    console.warn("Attempted to set an undefined value in session.");
    return;
  }

  const now = new Date();
  const lifeTime = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(now.getTime() + lifeTime);

  const item = {
    value: value,
    expiresAt: expirationDate.toISOString(),
  };

  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error setting session:", error);
  }
};

export const getSession = (key = SESSION_KEY) => {
  if (typeof window === "undefined") return;
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  let item;
  try {
    item = JSON.parse(itemStr);
  } catch (error) {
    console.error("Error parsing session data:", error);
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
    return null;
  }

  const now = new Date();
  if (new Date(item.expiresAt) < now) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

export const clearAllSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("access_token");
};
