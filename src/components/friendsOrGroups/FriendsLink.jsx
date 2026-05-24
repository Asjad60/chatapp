import React from "react";
import { Link } from "react-router-dom";

const FriendsLink = ({ friend, id, newMessageAlert }) => {
  const isSelected = id === friend._id;

  // Let's compute a dynamic time and message snippet for premium display
  const isOnline = friend.status === "online";
  const statusText = isOnline ? "Active now" : "Offline";
  const lastMessageMock = isOnline
    ? "Yeah, the design looks amazing..."
    : "Let's catch up later!";

  const timeMock = isOnline ? "Just now" : "Yesterday";

  return (
    <Link
      to={`/chat/${friend._id}?username=${encodeURIComponent(
        friend.username,
      )}&imageUrl=${encodeURIComponent(friend.image.url)}`}
      className={`block w-full rounded-2xl transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-[#e1eafd] border border-blue-100/60 chat-shadow-sm"
          : "hover:bg-slate-50 border border-transparent"
      } p-3`}
    >
      <div className="flex items-center gap-3 relative w-full">
        {/* Avatar Area with Status Dot */}
        <div className="relative shrink-0">
          <picture>
            <img
              src={friend.image.url}
              alt={friend.username}
              className="w-11 h-11 object-cover rounded-full shadow-sm border border-slate-100"
              loading="lazy"
            />
          </picture>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* Info Area */}
        <div className="flex flex-col flex-grow overflow-hidden pr-2">
          {/* Username & Time */}
          <div className="flex items-center justify-between w-full">
            <span
              className={`capitalize text-xs font-bold truncate ${
                isSelected ? "text-[#0047e1]" : "text-slate-800"
              }`}
            >
              {friend.username}
            </span>
            {/* <span
              className={`text-[9px] shrink-0 font-semibold ${
                newMessageAlert ? "text-[#0047e1] font-bold" : "text-slate-400"
              }`}
            >
              {timeMock}
            </span> */}
          </div>

          {/* Last Message or Status */}
          <div className="flex items-center justify-between w-full mt-0.5">
            {/* <p className="text-[10px] text-slate-400 truncate flex-grow pr-1">
              {lastMessageMock}
            </p> */}
            {newMessageAlert && (
              <span className="shrink-0 bg-[#0047e1] text-white text-[8px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {newMessageAlert.count}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FriendsLink;
