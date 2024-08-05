import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const ChatList = ({ messages, userId }) => {
  // console.log("userId => ", userId);
  return (
    <div className="w-full flex flex-col gap-2">
      {messages?.map((msg, i) => {
        return (
          <div
            key={i + msg.content}
            className={`flex text-white ${
              userId === msg.sender && "justify-end "
            }`}
          >
            {msg.content && (
              <div
                className={` bg-black/70 max-w-[300px] break-words ${
                  msg.sender === userId
                    ? " rounded-md rounded-tr-none p-1"
                    : "rounded-md rounded-ss-none p-2"
                }`}
                style={{
                  backgroundColor: msg.sender === userId && "darkgreen",
                }}
              >
                <p> {msg.content}</p>
                {msg.sender === userId && (
                  <p className={`${msg?.seen && "text-sky-500"} float-right`}>
                    <IoCheckmarkDoneSharp size={16} />
                  </p>
                )}
              </div>
            )}
            {msg.attachments?.length > 0 && (
              <div className="flex flex-col gap-2">
                {msg.attachments.map((file, i) => (
                  <Link
                    to={file.url}
                    target="_blank"
                    key={`${file._id}_${i}`}
                    className={` relative flex flex-col  max-w-[250px] gap-2 p-1 ${
                      msg.sender === userId
                        ? "bg-[darkgreen]/70"
                        : "bg-black/70"
                    } rounded-md`}
                  >
                    <picture key={i}>
                      <img
                        src={file.url}
                        alt={"files"}
                        className=" w-full h-full object-contain rounded-md"
                      />
                    </picture>

                    <span
                      className={`absolute right-1.5 bottom-1.5 ${
                        msg?.seen && "text-sky-500"
                      } ${msg.sender !== userId && "hidden"} place-self-end`}
                    >
                      <IoCheckmarkDoneSharp size={16} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
