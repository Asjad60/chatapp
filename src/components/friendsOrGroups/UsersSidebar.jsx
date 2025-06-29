import React, { useCallback, useEffect, useState } from "react";
import { getMyFriends } from "../../services/operations/userAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getContextData } from "../../context/AuthProvider";
import { getSocket } from "../../context/SocketProvider";
import { useSelector } from "react-redux";
import FriendsLink from "./FriendsLink";
import { getMyGroups } from "../../services/operations/groupAPI";

const UsersSidebar = () => {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { newMessageAlert } = useSelector((state) => state.chat);
  const { lastChatWith, token, setToken } = getContextData();
  const socket = getSocket();
  const navigate = useNavigate();

  const handleUserStatus = useCallback((data) => {
    const newData = new Set(data);
    setFriends((prevFriends) =>
      prevFriends?.map((friend) =>
        newData.has(friend._id)
          ? { ...friend, status: "online" }
          : { ...friend, status: "offline" }
      )
    );
  }, []);

  const fetchMyFriends = async () => {
    setLoading(true);
    const result = await getMyFriends(token, navigate, setToken);
    if (result) {
      setFriends(result.friends);
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
          setFriends(friendsResult.friends);
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

    fetchInitialData();
  }, []);

  const requestStatus = () => {
    setTimeout(() => {
      socket.emit("user_status");
    }, 100);
  };

  const handleJoinGroup = (data) => {
    setGroups((prev) => [...prev, data]);
  };

  useEffect(() => {
    if (socket.connected) {
      requestStatus();
    }

    socket.on("connect", requestStatus);
    socket.on("join_group", handleJoinGroup);
    socket.on("user_status", handleUserStatus);
    socket.on("refetch_friends", () => fetchMyFriends());

    return () => {
      socket.off("user_status", handleUserStatus);
      socket.off("refetch_friends");
      socket.off("join_group", handleJoinGroup);
    };
  }, [socket, handleUserStatus, requestStatus]);

  return (
    <aside className="text-slate-100">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className=" w-full h-screen flex flex-col gap-4 overflow-y-auto p-3">
          {friends?.length > 0 ? (
            friends
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
            <p className="mx-auto mt-2 font-inter font-bold text-5xl ml-3 text-black/20 -rotate-45">
              No friends found
            </p>
          )}

          <h4 className="text-2xl font-edu-sa font-semibold p-3">Groups</h4>

          {groups?.length > 0 ? (
            groups.map((group) => (
              <Link
                to={`/chat/${group._id}?groupname=${encodeURIComponent(
                  group.groupName
                )}`}
                key={group._id}
                className={`text-white px-2 rounded-lg ${
                  id === group._id && "border border-[#1a2c4d]"
                }`}
              >
                <div className="flex gap-3 items-center py-2">
                  {group?.groupProfile ? (
                    <img
                      src={group?.groupProfile}
                      alt="Group-Profile"
                      className="object-cover rounded-full w-[40px] h-[40px]"
                    />
                  ) : (
                    <div className="capitalize p-2 rounded-full bg-[#255487] w-[40px] h-[40px] flex justify-center items-center">
                      {group?.groupName[0]}
                    </div>
                  )}
                  <span>{group?.groupName}</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-white">No groups found.</p>
          )}
        </div>
      )}
    </aside>
  );
};

export default UsersSidebar;
