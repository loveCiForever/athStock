// .client/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import {
  deleteSession,
  getSession,
  setSession,
} from "../components/common/session.jsx";
import { getApps } from "firebase/app";

const authContext = createContext();
export const useAuthContext = () => useContext(authContext);

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const data = getSession();
    if (data) {
      setUser(data);
    }
  }, []);

  const configUser = (user, access_token) => {
    // console.log(access_token);
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
    <authContext.Provider value={{ user, configUser, signout, getAccessToken }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContext;
