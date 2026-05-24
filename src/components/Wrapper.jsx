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
    [id],
  );

  const handleReadNotifications = useCallback((data) => {
    console.log("updated Noptification => ", data);
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...item, read: data.read } : item,
      ),
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
  }, [gettingNotifications, handleNewMessageAlert, handleReadNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center bg-[#f4f7fc] min-h-[100dvh]">
      <div className="relative w-full h-[100dvh] flex z-10 bg-[#f4f7fc] overflow-hidden">
        {/* Column 1: Leftmost Navigation Sidebar (Navbar) */}
        <div className="hidden md:flex w-[240px] h-full bg-[#f4f7fc] border-r border-slate-200/80 shrink-0">
          <Navbar />
        </div>

        {/* Column 2: Middle-left Chat List & Search (UsersSidebar) */}
        {/*
          Mobile visibility rules:
          - Show when at "/" (home / chats list)
          - Show when at "/?type=groups" (groups list)
          - HIDE when inside "/chat/:id" (active chat/group chat)
          Desktop: always show (md:flex)
        */}
        <div
          className={`${
            location.pathname !== "/" ? "hidden md:flex" : "flex"
          } w-full md:w-[320px] h-full bg-[#f8f9fb] border-r border-slate-200/60 flex-col shrink-0 overflow-hidden relative`}
        >
          {/* Mobile Navigation Header */}
          <div className="md:hidden block w-full bg-[#f4f7fc] border-b border-slate-100">
            <Navbar isMobileHeader={true} />
          </div>
          <UsersSidebar />
        </div>

        {/* Column 3: Active Chat Feed Area (Outlet) */}
        {/*
          Mobile visibility rules:
          - Show when inside "/chat/:id"
          - Hide at "/" and "/?type=groups" (show sidebar instead)
          Desktop: always show
        */}
        <div
          className={`${
            location.pathname !== "/" ? "flex" : "hidden md:flex"
          } flex-1 h-full relative overflow-hidden bg-[#f4f7fc]`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
