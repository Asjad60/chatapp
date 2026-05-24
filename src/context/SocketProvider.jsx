import React, { createContext, useContext, useMemo, useEffect } from "react";
import { io } from "socket.io-client";
import { getContextData } from "./AuthProvider";

export const Context = createContext();

export const getSocket = () => {
  const socket = useContext(Context);
  return socket;
};

const SocketProvider = ({ children }) => {
  const serverUrl = import.meta.env.VITE_IO_SERVER;
  const { token } = getContextData();

  if (!serverUrl) {
    throw new Error("Socket server URL is undefined");
  }

  // Create the socket ONCE with autoConnect:false so it never connects by itself.
  const socket = useMemo(
    () =>
      io(serverUrl, {
        withCredentials: true,
        autoConnect: false,
        // WebSocket-only: avoids HTTP-polling which browsers heavily throttle
        // for background tabs, which was causing false "offline" status.
        transports: ["websocket"],
        // Generous reconnection config — don't spam the server
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        // Must be > server's pingTimeout (120 000 ms) so the client doesn't
        // give up before the server has a chance to send the next ping.
        timeout: 130000,
      }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Connect when the user logs in, disconnect when they log out.
  useEffect(() => {
    if (token) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [token, socket]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return <Context.Provider value={socket}>{children}</Context.Provider>;
};

export default SocketProvider;
