import React, { useCallback, useEffect, useState } from "react";
import { getMyFriends } from "../../services/operations/userAPI";
import { useParams } from "react-router-dom";
import { getContextData } from "../../context/AuthProvider";
import { getSocket } from "../../context/SocketProvider";
import { useSelector } from "react-redux";
import FriendsLink from "./FriendsLink";

const UsersSidebar = () => {
  const [friends, setFriends] = useState([]);
  const { id } = useParams();
  const { newMessageAlert } = useSelector((state) => state.chat);
  const { lastChatWith } = getContextData();
  const socket = getSocket();

  const handleUserStatus = useCallback(
    (data) => {
      setFriends((prevFriends) =>
        prevFriends?.map((friend) =>
          data.includes(friend._id)
            ? { ...friend, status: "online" }
            : { ...friend, status: "offline" }
        )
      );
    },
    [friends]
  );

  const fetchMyFriends = async () => {
    const result = await getMyFriends();
    if (result) {
      setFriends(result.friends);
    }
  };

  useEffect(() => {
    localStorage.setItem("new_message_alert", JSON.stringify(newMessageAlert));
  }, [newMessageAlert]);

  useEffect(() => {
    fetchMyFriends();
  }, []);

  useEffect(() => {
    socket.on("user_status", handleUserStatus);
    socket.on("refetch_friends", () => fetchMyFriends());

    return () => {
      socket.off("user_status", handleUserStatus);
      socket.off("refetch_friends");
    };
  }, [socket, handleUserStatus]);

  return (
    <aside className="max-w-[200px] border-r border-stone-800 w-full overflow-hidden">
      <div className=" w-full flex flex-col gap-4 ">
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
          <h2 className="mx-auto mt-2 font-inter font-bold text-5xl ml-3 text-black/20 -rotate-45">
            You Don't Have Friends
          </h2>
        )}
      </div>
    </aside>
  );
};

export default UsersSidebar;
