import React, { useCallback, useEffect } from "react";
import UsersSidebar from "./friendsOrGroups/UsersSidebar";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { getSocket } from "../context/SocketProvider";
import Navbar from "./Navbar/Navbar";
import { useDispatch } from "react-redux";
import { getContextData } from "../context/AuthProvider";
import { getNotifications } from "../services/operations/userAPI";
import { setNewMessageAlert } from "../slices/chatSlice";

const Wrapper = () => {
  const socket = getSocket();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { setNotifications } = getContextData();

  const fetchNotifications = async () => {
    const result = await getNotifications();
    if (result) {
      setNotifications(result.notifications);
    }
  };

  const gettingNotifications = useCallback((data) => {
    console.log("New notification data:", data);
    if (Array.isArray(data)) {
      setNotifications(data);
    } else {
      setNotifications((prev) => {
        if (!Array.isArray(prev)) {
          return prev;
        }
        return [...prev, data];
      });
    }
  }, []);

  const handleNewMessageAlert = useCallback(
    ({ sender }) => {
      if (sender === id) return;
      dispatch(setNewMessageAlert({ sender }));
    },
    [id]
  );

  const handleReadNotifications = useCallback((data) => {
    console.log("updated Noptification => ", data);
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...item, read: data.read } : item
      )
    );
  }, []);

  useEffect(() => {
    socket.on("notification", gettingNotifications);
    socket.on("new_message_alert", handleNewMessageAlert);
    socket.on("read_notification", handleReadNotifications);
    return () => {
      socket.off("notification", gettingNotifications);
      socket.off("new_message_alert", handleNewMessageAlert);
      socket.off("read_notification", handleReadNotifications);
    };
  }, [
    socket,
    gettingNotifications,
    handleNewMessageAlert,
    handleReadNotifications,
  ]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    fetchNotifications();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* <Navbar /> */}
      <div className="relative w-full h-screen border border-gray-600/30 rounded-b-lg flex z-10">
        <div className="sm:max-w-[350px] sm:border-r border-gray-600/30 w-full overflow-hidden sm:static absolute inset-0 z-[11] ">
          <Navbar />
          <UsersSidebar />
        </div>
        <div
          className={`w-full h-full [background:radial-gradient(110%_110%_at_70%_5%,#000_40%,#29536E_100%)] ${
            location.pathname !== "/" ? "z-[20]" : "z-[5]"
          } absolute sm:relative inset-0 `}
        >
          <div className="absolute inset-0 opacity-20 z-0 h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="relative w-full h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
