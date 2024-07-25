import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

export const AuthContext = createContext();

export const getContextData = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [lastChatWith, setLastChatWith] = useState(
    localStorage.getItem("lastChatWith")
      ? JSON.parse(localStorage.getItem("lastChatWith"))
      : null
  );
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    localStorage.setItem("lastChatWith", JSON.stringify(lastChatWith));
  }, [lastChatWith]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      user,
      setUser,
      lastChatWith,
      setLastChatWith,
      notifications,
      setNotifications,
    }),
    [token, user, lastChatWith, notifications]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
