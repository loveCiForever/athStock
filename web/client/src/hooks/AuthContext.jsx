// ./client/src/components/hooks-services/AuthContext.jsx

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  deleteSession,
  getSession,
  setSession,
} from "../services/useSession.jsx";

const authContext = createContext();
export const useAuthContext = () => useContext(authContext);

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getSession();
    if (data) {
      setUser(data);
    }
    setLoading(false);
  }, []);

  const configUser = (user, access_token) => {
    setSession(user);
    setUser(user);
    if (access_token) {
      setAccessToken(access_token);
      localStorage.setItem("access_token", access_token);
    }
  };

  const getAccessToken = () => {
    return accessToken || localStorage.getItem("access_token");
  };

  const signout = () => {
    setUser(null);
    setAccessToken(null);
    deleteSession();
    localStorage.removeItem("access_token");
  };

  return (
    <authContext.Provider
      value={{ user, configUser, signout, getAccessToken, loading }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthContext;
