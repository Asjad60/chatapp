import React from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { Link, useSearchParams } from "react-router-dom";

const ChatList = ({ messages, userId }) => {
  const [searchParams] = useSearchParams();
  const isGroupName = searchParams.has("groupname");
  const partnerUsername = searchParams.get("username");
  const partnerImageUrl = searchParams.get("imageUrl");

  const formatTime = (dateStr) => {
    // Real-time socket messages arrive without createdAt — fall back to
    // the current time, which is accurate since the message just arrived.
    const date = dateStr ? new Date(dateStr) : new Date();
    try {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const formatDateLabel = (dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    try {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch (e) {
      return "Today";
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 px-4 font-comfortaa">
      {messages?.map((msg, i) => {
        const senderId =
          typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
        const isSentByCurrentUser = senderId === userId;

        // Render date divider when the day changes
        const showDateDivider =
          i === 0 ||
          (msg.createdAt &&
            messages[i - 1].createdAt &&
            new Date(msg.createdAt).toDateString() !==
              new Date(messages[i - 1].createdAt).toDateString());

        // Get avatar and name for left side messages
        const senderUsername = isGroupName
          ? msg.sender?.username || "Group Member"
          : partnerUsername || "User";
        const senderAvatar = isGroupName
          ? msg.sender?.image?.url
          : partnerImageUrl;

        return (
          <div
            key={msg._id || `${i}_${msg.content}`}
            className="flex flex-col w-full"
          >
            {/* Date Divider */}
            {showDateDivider && (
              <div className="flex justify-center my-4">
                <span className="bg-[#e9effa] text-[#818cf8] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {formatDateLabel(msg.createdAt)}
                </span>
              </div>
            )}

            {/* Message Row */}
            <div
              className={`flex w-full ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {/* Left Side Avatar */}
              {!isSentByCurrentUser && (
                <div className="mr-3 self-end shrink-0 mb-1">
                  {senderAvatar ? (
                    <img
                      src={senderAvatar}
                      alt={senderUsername}
                      className="w-9 h-9 object-cover rounded-full shadow-sm border border-slate-100"
                    />
                  ) : (
                    <div className="capitalize font-bold text-xs rounded-full bg-blue-600/10 text-blue-600 w-9 h-9 flex justify-center items-center">
                      {senderUsername[0]}
                    </div>
                  )}
                </div>
              )}

              {/* Message Content Area */}
              <div className="flex flex-col max-w-[70%] gap-1">
                {/* Group Sender Name */}
                {isGroupName && !isSentByCurrentUser && (
                  <span className="text-[10px] font-bold text-[#0047e1] px-1 capitalize mb-0.5">
                    {senderUsername}
                  </span>
                )}

                {/* Text Bubble */}
                {msg.content && (
                  <div
                    className={`p-3.5 chat-shadow-sm rounded-2xl ${
                      isSentByCurrentUser
                        ? "bg-[#0047e1] text-white rounded-tr-sm"
                        : "bg-white text-slate-800 rounded-tl-sm"
                    }`}
                  >
                    {/* Render replica of Replied-to context if it is the first mock message to mimic high-fidelity reference layout */}
                    {/* {!isSentByCurrentUser && i === 0 && !isGroupName && (
                      <div className="mb-2 p-2 bg-slate-50 border-l-2 border-slate-300 rounded-r-lg text-[10px] text-slate-400 flex flex-col">
                        <span className="font-bold text-slate-500">You</span>
                        <span className="truncate">I've uploaded the new wireframes to the shared folder. L...</span>
                      </div>
                    )} */}

                    <p className="text-xs leading-relaxed break-words font-medium">
                      {msg.content}
                    </p>
                  </div>
                )}

                {/* Attachment Media Bubble */}
                {msg.attachments?.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1">
                    {msg.attachments.map((file, j) => (
                      <div
                        key={`${file._id}_${j}`}
                        className={`p-2 rounded-2xl overflow-hidden chat-shadow-sm ${
                          isSentByCurrentUser
                            ? "bg-[#0047e1]/10 border border-blue-100"
                            : "bg-white"
                        }`}
                      >
                        <Link
                          to={file.url}
                          target="_blank"
                          className="block relative overflow-hidden rounded-xl"
                        >
                          <img
                            src={file.url}
                            alt="attachment"
                            className="w-full max-h-[220px] object-cover hover:scale-[1.02] transition-transform duration-200"
                          />
                        </Link>
                        {/* Styled Caption block if image caption fits */}
                        {/* {isSentByCurrentUser && (
                          <div className="p-2 text-[10px] text-slate-500 font-semibold italic">
                            Thinking we could apply this sort of layout for the
                            dashboard.
                          </div>
                        )} */}
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Time & Status */}
                <div
                  className={`flex items-center gap-1.5 mt-1 ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <span className="text-[9px] text-slate-400 font-semibold">
                    {formatTime(msg.createdAt)}
                  </span>
                  {isSentByCurrentUser && (
                    <span
                      className={`${msg?.seen ? "text-[#0047e1]" : "text-slate-300"}`}
                    >
                      <IoCheckmarkDoneSharp size={13} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
