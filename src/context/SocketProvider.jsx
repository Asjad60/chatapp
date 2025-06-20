import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

export const Context = createContext();

export const getSocket = () => {
  const socket = useContext(Context);
  return socket;
};

const SocketProvider = ({ children }) => {
  const serverUrl = import.meta.env.VITE_IO_SERVER;

  if (!serverUrl) {
    throw new Error("Socket server URL is undefined");
  }

  const socket = useMemo(
    () =>
      io(serverUrl, {
        withCredentials: true,
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      }),
    []
  );

  return <Context.Provider value={socket}>{children}</Context.Provider>;
};

export default SocketProvider;
