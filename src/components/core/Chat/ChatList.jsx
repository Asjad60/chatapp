import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { Link, useSearchParams } from "react-router-dom";

const ChatList = ({ messages, userId }) => {
  const [searchParams] = useSearchParams();
  const groupName = searchParams.has("groupname");
  return (
    <div className="w-full flex flex-col gap-2 pl-1">
      {messages?.map((msg, i) => {
        // console.log("msg: ", msg);
        const senderId =
          typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
        const isSentByCurrentUser = senderId === userId;

        return (
          <div
            key={msg._id || `${i}_${msg.content}`}
            className={`flex text-white ${
              isSentByCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {msg.content && (
              <div
                className={`max-w-[150px] min-[335px]:max-w-[300px] break-words ${
                  isSentByCurrentUser
                    ? "rounded-md rounded-tr-none p-1"
                    : "rounded-md rounded-ss-none p-2"
                }`}
                style={{
                  backgroundColor: isSentByCurrentUser
                    ? "darkgreen"
                    : "rgba(0,0,0,0.7)",
                }}
              >
                {groupName && userId !== senderId && (
                  <span className="font-bold text-yellow-600 text-sm font-inter">
                    {msg?.sender?.username}
                  </span>
                )}

                <p>{msg.content}</p>
                {isSentByCurrentUser && (
                  <p
                    className={`${msg?.seen ? "text-sky-500" : ""} float-right`}
                  >
                    <IoCheckmarkDoneSharp size={16} />
                  </p>
                )}
              </div>
            )}

            {msg.attachments?.length > 0 && (
              <div className="flex flex-col gap-2">
                {msg.attachments.map((file, j) => (
                  <Link
                    to={file.url}
                    target="_blank"
                    key={`${file._id}_${j}`}
                    className={`relative flex flex-col max-w-[250px] gap-2 p-1 ${
                      isSentByCurrentUser ? "bg-[darkgreen]/70" : "bg-black/70"
                    } rounded-md`}
                  >
                    {groupName && userId !== senderId && (
                      <span className="font-bold text-yellow-600 text-sm font-inter">
                        {msg?.sender?.username}
                      </span>
                    )}
                    <img
                      src={file.url}
                      alt="attachment"
                      className="w-full h-full object-contain rounded-md"
                    />
                    {isSentByCurrentUser && (
                      <span
                        className={`absolute right-1.5 bottom-1.5 ${
                          msg?.seen ? "text-sky-500" : ""
                        }`}
                      >
                        <IoCheckmarkDoneSharp size={16} />
                      </span>
                    )}
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
