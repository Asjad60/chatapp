import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { getContextData } from "../../context/AuthProvider";
import { logoutUser } from "../../services/operations/authAPI";
import { IoNotifications } from "react-icons/io5";
import Button from "../Button";
import { getSocket } from "../../context/SocketProvider";
import { IoIosLogOut, IoIosSearch } from "react-icons/io";
import {
  IoChatbubbleEllipses,
  IoCompassOutline,
  IoPersonOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import SearchUsers from "./SearchUsers";
import { GrGroup } from "react-icons/gr";
import ModalViewer from "../ModalViewer";
import { AnimatePresence } from "framer-motion";
import GroupTemplate from "./group";
import { toast } from "react-hot-toast";

const Navbar = ({ isMobileHeader = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchUser, setSearchUser] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [users, setUsers] = useState([]);
  const { token, setToken, user, notifications } = getContextData();
  const socket = getSocket();

  const handleLogout = async () => {
    await logoutUser(token, setToken, navigate);
    socket.disconnect();
  };

  const unreadNotificationsCount =
    notifications?.filter((item) => !item.read).length || 0;

  // High-fidelity active tab computations
  const activeType = searchParams.get("type") || "chats";
  const isGroupChat =
    location.search.includes("groupname") || activeType === "groups";

  const isActiveChat =
    (location.pathname === "/" || location.pathname.startsWith("/chat/")) &&
    !isGroupChat;
  const isActiveGroup =
    (location.pathname === "/" || location.pathname.startsWith("/chat/")) &&
    isGroupChat;
  const isActiveDiscovery = location.pathname === "/discovery";
  const isActiveNotification = location.pathname === "/notification";

  if (isMobileHeader) {
    return (
      <div className="w-full flex items-center justify-between p-3.5 bg-white border-b border-slate-100 chat-shadow-sm font-comfortaa">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            C
          </div>
          <span className="font-extrabold text-[#0047e1] text-sm">
            Chit Chat
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Search trigger */}
          <button
            onClick={() => setSearchUser(true)}
            className="p-1.5 text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all duration-150 cursor-pointer"
            title="Search User / New Chat"
          >
            <IoIosSearch size={18} />
          </button>

          {/* Notifications */}
          <Link
            to="/notification"
            className="relative p-1.5 text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all duration-150"
            title="Notifications"
          >
            <IoNotifications size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                {unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* Create Group */}
          <button
            onClick={() => setIsCreatingGroup(true)}
            className="p-1.5 text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all duration-150 cursor-pointer"
            title="Create Group"
          >
            <GrGroup size={16} />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-1.5 text-red-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-xl transition-all duration-150 cursor-pointer"
            title="Logout"
          >
            <IoIosLogOut size={18} />
          </button>
        </div>

        {/* Modals for Search and Group Template */}
        <AnimatePresence>
          {searchUser && (
            <ModalViewer onClose={() => setSearchUser(false)}>
              <SearchUsers
                user={user}
                users={users}
                setUsers={setUsers}
                searchUser={searchUser}
                setSearchUser={setSearchUser}
              />
            </ModalViewer>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCreatingGroup && (
            <ModalViewer onClose={() => setIsCreatingGroup(false)}>
              <GroupTemplate setIsCreatingGroup={setIsCreatingGroup} />
            </ModalViewer>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-[#f4f7fc] text-slate-700 font-comfortaa">
      {/* Top Section */}
      <div className="flex flex-col gap-6 w-full">
        {/* Chit Chat Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-blue-500/20">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[#0047e1] text-[17px] leading-tight">
              Chit Chat
            </span>
          </div>
        </div>

        {/* "+ New Chat" Button */}
        <button
          onClick={() => setSearchUser(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#0047e1] text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-[0.97] transition-all duration-150 shadow-md hover:shadow-lg shadow-blue-500/10 cursor-pointer"
        >
          <span className="text-xl leading-none font-light">+</span>
          <span className="text-sm">New Chat</span>
        </button>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5 mt-4">
          {/* Chats Tab */}
          <Link
            to="/?type=chats"
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold transition-all duration-200 ${
              isActiveChat
                ? "bg-[#e1eafd] text-[#0047e1] shadow-sm"
                : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-800"
            }`}
          >
            <IoChatbubbleEllipses size={19} />
            <span className="text-xs">Chats</span>
          </Link>

          {/* Discovery Tab */}
          <Link
            to="/discovery"
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold transition-all duration-200 ${
              isActiveDiscovery
                ? "border border-blue-500 border-dashed text-[#0047e1] bg-blue-50/30"
                : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-800"
            }`}
          >
            <IoCompassOutline size={19} />
            <span className="text-xs">Discovery</span>
          </Link>

          {/* Groups Tab */}
          <Link
            to="/?type=groups"
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold transition-all duration-200 ${
              isActiveGroup
                ? "bg-[#e1eafd] text-[#0047e1] shadow-sm"
                : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-800"
            }`}
          >
            <GrGroup
              size={17}
              className={isActiveGroup ? "text-[#0047e1]" : "text-slate-500"}
            />
            <span className="text-xs text-left">Groups</span>
          </Link>

          {/* Notifications Tab */}
          <Link
            to="/notification"
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold transition-all duration-200 ${
              isActiveNotification
                ? "bg-[#e1eafd] text-[#0047e1] shadow-sm"
                : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-800"
            }`}
          >
            <IoNotifications
              size={19}
              className={
                isActiveNotification ? "text-[#0047e1]" : "text-slate-500"
              }
            />
            <span className="text-xs">Notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[9px] py-0.5 px-2 rounded-full font-bold">
                {unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* Profile Tab */}
          <button
            onClick={() => {
              if (user) {
                toast.success(`Logged in as ${user.username}`);
              }
            }}
            className="flex items-center w-full gap-3.5 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 transition-all duration-200 cursor-pointer"
          >
            <IoPersonOutline size={19} />
            <span className="text-xs text-left">Profile</span>
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-1 w-full">
        {/* Settings */}
        <button
          onClick={() => toast.success("Settings are managed automatically")}
          className="flex items-center w-full gap-3.5 px-4 py-2.5 rounded-2xl font-bold text-slate-400 hover:bg-slate-200/50 hover:text-slate-700 transition-all duration-200 cursor-pointer"
        >
          <IoSettingsOutline size={19} />
          <span className="text-xs text-left">Settings</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3.5 px-4 py-2.5 rounded-2xl font-bold text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 cursor-pointer"
        >
          <IoIosLogOut size={19} />
          <span className="text-xs text-left">Logout</span>
        </button>
      </div>

      {/* Modals for Search and Group Template */}
      <AnimatePresence>
        {searchUser && (
          <ModalViewer onClose={() => setSearchUser(false)}>
            <SearchUsers
              user={user}
              users={users}
              setUsers={setUsers}
              searchUser={searchUser}
              setSearchUser={setSearchUser}
            />
          </ModalViewer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreatingGroup && (
          <ModalViewer onClose={() => setIsCreatingGroup(false)}>
            <GroupTemplate setIsCreatingGroup={setIsCreatingGroup} />
          </ModalViewer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
