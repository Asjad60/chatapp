import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getContextData } from "../context/AuthProvider";
import { IoIosSend } from "react-icons/io";
import ChatList from "../components/core/Chat/ChatList";
import { getAllChats } from "../services/operations/chatAPI";
import Button from "../components/Button";
import { getSocket } from "../context/SocketProvider";
import SendAttchments from "../components/core/Chat/SendAttchments";
import { useDispatch } from "react-redux";
import { removeNewMessagesAlert } from "../slices/chatSlice";
import ChatProfileHeader from "../components/core/Chat/ChatProfileHeader";
import { fetchGroupMessages } from "../services/operations/groupAPI";

const Chat = () => {
  const { user, setLastChatWith } = getContextData();
  const [loading, setLoading] = useState(false);
  const socket = getSocket();
  const { id } = useParams();
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchParams] = useSearchParams();
  const isGroupName = searchParams.has("groupname");

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      if (!isGroupName) {
        const newMessage = {
          sender: user._id,
          receiver: id,
          content: content.trim(),
        };
        socket.emit("new_message", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setContent("");
        setLastChatWith(id);
      } else {
        socket.emit("group_message", { groupId: id, message: content });
        setContent("");
        setLastChatWith(id);
      }
    }
  };

  const handleNewMessage = useCallback(
    (data) => {
      console.log(data);
      if (!isGroupName) {
        if (data.receiver === id || data.sender === id) {
          setMessages((prevMessages) => [...prevMessages, data]);
          socket.emit("message_seen", { senderId: user._id, receiverId: id });
        }
      } else if (isGroupName && data.group === id) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    },
    [messages]
  );

  const handleMessageSeen = useCallback(
    (data) => {
      if (data.receiverId === id || data.senderId === id) {
        setMessages((prevMessages) =>
          prevMessages.map((msgObj) =>
            msgObj.sender === data.receiverId
              ? { ...msgObj, seen: data.seen }
              : msgObj
          )
        );
      }
    },
    [messages]
  );

  const fetchChats = async () => {
    setLoading(true);

    try {
      if (!isGroupName) {
        const result = await getAllChats(id);
        if (result) {
          setMessages(result.messages);
        }
      } else {
        socket.emit("join_room", { groupId: id });
        const result = await fetchGroupMessages(id);
        if (result) {
          setMessages(result.messages);
        }
      }
      setTimeout(() => {
        if (ref.current) {
          ref.current.scrollIntoView();
        }
      }, 50);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchChats();
      dispatch(removeNewMessagesAlert(id));
      socket.emit("message_seen", { senderId: user._id, receiverId: id });
      inputRef.current.focus();
    }
  }, [id]);

  useEffect(() => {
    socket.on("new_message", handleNewMessage);
    socket.on("message_seen", handleMessageSeen);
    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_seen", handleMessageSeen);
    };
  }, [socket, handleMessageSeen]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // console.log("hello");

  return (
    <section
      className="w-full h-full flex flex-col  bg-cover bg-center bg-no-repeat "
      ref={containerRef}
      // style={{
      //   backgroundImage: `url(${bgArray[bgImageIndex]})`,
      // }}
    >
      <div className="bg-[rgba(0,0,0,0.2)] relative h-full pb-1 ">
        <ChatProfileHeader ref={containerRef} userId={user._id} />

        <div className="h-[calc(100dvh-140px)] pb-1 overflow-y-auto pt-1">
          {!loading ? (
            <ChatList messages={messages} userId={user._id} />
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="loader"></div>
            </div>
          )}
          <div ref={ref} />
        </div>
        <div className="form-style p-2 flex items-center gap-2 w-full">
          <SendAttchments setLastChatWith={setLastChatWith} id={id} />
          <form onSubmit={handleSubmit} className="flex gap-4 w-full">
            <div className="flex items-center w-full gap-2">
              <input
                type="text"
                name="content"
                className="bg-transparent w-full outline-none py-2 text-white  placeholder:text-white"
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter Message"
                value={content}
                autoComplete="off"
                ref={inputRef}
              />
              <Button type="submit" customClass={"p-2 p rounded-full"}>
                <IoIosSend size={25} />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Chat;
