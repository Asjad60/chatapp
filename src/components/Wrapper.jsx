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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3">
      <Navbar />
      <div className="relative overflow-hidden max-w-[900px] w-full min-h-[75vh] border border-gray-600/30 rounded-b-lg flex z-10">
        <UsersSidebar />
        <div
          className={`w-full h-full ${
            location.pathname !== "/" ? "z-[20]" : "z-[5]"
          } absolute sm:static inset-0 bg-slate-100`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
