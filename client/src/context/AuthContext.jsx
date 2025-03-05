// .client/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import {
  deleteSession,
  getSession,
  setSession,
} from "../components/auth/session.jsx";

const authContext = createContext();
export const useAuthContext = () => useContext(authContext);

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = getSession();
    if (data) {
      setUser(data);
    }
  }, []);

  const configUser = (data) => {
    setSession(data);
    setUser(data);
  };

  const signout = () => {
    setUser(null);
    deleteSession();
  };

  return (
    <authContext.Provider value={{ user, configUser, signout }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContext;
