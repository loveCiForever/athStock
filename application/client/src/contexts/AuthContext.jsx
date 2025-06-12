// ./application/client/src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getSession, setSession, clearAllSession } from "../hooks/useSession";

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );

  useEffect(() => {
    const sessionUser = getSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const configUser = (userData, token) => {
    setSession(userData);
    setUser(userData);
    if (token) {
      setAccessToken(token);
      localStorage.setItem("access_token", token);
    }
  };

  const getAccessToken = () => {
    if (accessToken) return accessToken;
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    clearAllSession();
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  };

  const contextValue = useMemo(
    () => ({ user, configUser, logout, getAccessToken, loading }),
    [user, accessToken, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
