import React, { useCallback, useEffect, useRef, useState } from "react";
import { getMyFriends } from "../../services/operations/userAPI";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getContextData } from "../../context/AuthProvider";
import { getSocket } from "../../context/SocketProvider";
import { useSelector } from "react-redux";
import FriendsLink from "./FriendsLink";
import { getMyGroups } from "../../services/operations/groupAPI";
import { IoSearchOutline, IoChatbubbleEllipses } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";

const UsersSidebar = () => {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  const { newMessageAlert } = useSelector((state) => state.chat);
  const { lastChatWith, token, setToken } = getContextData();
  const socket = getSocket();
  const navigate = useNavigate();

  // Read search parameters for type sorting
  const [searchParams] = useSearchParams();
  const activeType = searchParams.get("type") || "chats";
  const isGroupChatActive = searchParams.has("groupname");

  // Cache the latest online-user set so we can apply it after friends load.
  // Without this, the user_status event arrives while friends=[] and is lost.
  const onlineUsersRef = useRef(new Set());

  const applyStatus = useCallback((onlineSet, friendsList) =>
    friendsList?.map((friend) =>
      onlineSet.has(friend._id)
        ? { ...friend, status: "online" }
        : { ...friend, status: "offline" }
    )
  , []);

  const handleUserStatus = useCallback((data) => {
    const newData = new Set(data);
    onlineUsersRef.current = newData; // always keep ref up-to-date
    setFriends((prevFriends) => applyStatus(newData, prevFriends));
  }, [applyStatus]);

  const fetchMyFriends = async () => {
    setLoading(true);
    const result = await getMyFriends(token, navigate, setToken);
    if (result) {
      // Apply whatever online status we already know about
      setFriends(applyStatus(onlineUsersRef.current, result.friends));
    }
    setLoading(false);
  };

  useEffect(() => {
    localStorage.setItem("new_message_alert", JSON.stringify(newMessageAlert));
  }, [newMessageAlert]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [friendsResult, groupsResult] = await Promise.all([
          getMyFriends(token, navigate, setToken),
          getMyGroups(),
        ]);

        if (friendsResult) {
          // Apply cached online status immediately after fetch completes.
          // This handles the race where user_status arrived before friends loaded.
          setFriends(applyStatus(onlineUsersRef.current, friendsResult.friends));
        }

        if (groupsResult) {
          setGroups(groupsResult.data);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData().then(() => {
      // After friends are loaded, request a fresh online-user list from the
      // server. This guarantees correct status even if the initial broadcast
      // raced with the async friend fetch.
      socket.emit("get_online_users");
    });
  }, []);

  const handleJoinGroup = useCallback((data) => {
    setGroups((prev) => [...prev, data]);
  }, []);

  useEffect(() => {
    socket.on("join_group", handleJoinGroup);
    socket.on("user_status", handleUserStatus);
    socket.on("refetch_friends", () => fetchMyFriends());

    return () => {
      socket.off("user_status", handleUserStatus);
      socket.off("refetch_friends");
      socket.off("join_group", handleJoinGroup);
    };
  }, [socket, handleJoinGroup, handleUserStatus]);

  // Search filtering logic
  const filteredFriends = friends?.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups?.filter((group) =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show only groups if type=groups OR if a group chat is currently open
  const showGroupsOnly = activeType === "groups" || isGroupChatActive;

  return (
    <aside className="w-full h-full flex flex-col bg-[#f8f9fb] text-slate-800 font-comfortaa">
      {/* Search chats bar */}
      <div className="p-4 pb-3 border-b border-slate-200/60">
        <div className="relative w-full flex items-center bg-white border border-slate-200/60 rounded-2xl px-4 py-2.5 focus-within:border-blue-200 transition-all duration-200 chat-shadow-sm">
          <IoSearchOutline size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none border-none pl-2.5 text-slate-700 text-xs font-semibold placeholder:text-slate-400"
          />
        </div>

        {/* Mobile-only Chats / Groups tab switcher */}
        <div className="md:hidden flex gap-1 mt-3 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => navigate("/?type=chats")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              !showGroupsOnly
                ? "bg-white text-[#0047e1] shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <IoChatbubbleEllipses size={14} />
            Chats
          </button>
          <button
            onClick={() => navigate("/?type=groups")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              showGroupsOnly
                ? "bg-white text-[#0047e1] shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <GrGroup size={13} />
            Groups
          </button>
        </div>
      </div>

      {loading ? (
        <div className="w-full flex-grow flex justify-center items-center">
          <div className="loader !border-[#0047e1]"></div>
        </div>
      ) : (
        <div className="w-full flex-grow overflow-y-auto p-4 flex flex-col gap-5 light-scrollbar">
          
          {/* Friends (Personal Chats) Section */}
          {!showGroupsOnly && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Personal Chats</span>
              {filteredFriends?.length > 0 ? (
                filteredFriends
                  ?.sort((a, b) =>
                    a._id.toString() === lastChatWith?.toString() &&
                    b._id.toString() !== lastChatWith?.toString()
                      ? -1
                      : 1
                  )
                  ?.map((friend) => {
                    const newMessageAlert2 = newMessageAlert?.find(
                      (item) => item.chatId?.toString() === friend._id?.toString()
                    );
                    return (
                      <FriendsLink
                        key={friend._id}
                        id={id}
                        friend={friend}
                        newMessageAlert={newMessageAlert2}
                      />
                    );
                  })
              ) : (
                <p className="text-slate-400 text-xs text-center py-4 italic">
                  {searchQuery ? "No matching chats" : "No friends found"}
                </p>
              )}
            </div>
          )}

          {/* Groups Section */}
          {showGroupsOnly && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Groups</span>
              {filteredGroups?.length > 0 ? (
                filteredGroups.map((group) => {
                  const isSelected = id === group._id;
                  return (
                    <Link
                      to={`/chat/${group._id}?groupname=${encodeURIComponent(
                        group.groupName
                      )}&type=groups`}
                      key={group._id}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#e1eafd] text-[#0047e1] font-bold border border-blue-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      {group?.groupProfile ? (
                        <img
                          src={group?.groupProfile}
                          alt="Group-Profile"
                          className="object-cover rounded-full w-10 h-10 shadow-sm border border-slate-100"
                        />
                      ) : (
                        <div className="capitalize font-bold text-sm rounded-full bg-[#0047e1]/10 text-[#0047e1] w-10 h-10 flex justify-center items-center">
                          {group?.groupName[0]}
                        </div>
                      )}
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="text-xs text-slate-800 font-bold truncate">{group?.groupName}</span>
                        <span className="text-[10px] text-slate-400 truncate">Group conversation</span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-slate-400 text-xs text-center py-4 italic">
                  {searchQuery ? "No matching groups" : "No groups found"}
                </p>
              )}
            </div>
          )}

        </div>
      )}
    </aside>
  );
};

export default UsersSidebar;
