import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

export const Context = createContext();

export const getSocket = () => {
  const socket = useContext(Context);
  return socket;
};

const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () =>
      io(import.meta.env.VITE_IO_SERVER, {
        withCredentials: true,
      }),
    []
  );

  return <Context.Provider value={socket}>{children}</Context.Provider>;
};

export default SocketProvider;
