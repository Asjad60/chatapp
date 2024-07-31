import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getContextData } from "../context/AuthProvider";
import { IoIosSend } from "react-icons/io";
import ChatList from "../components/core/Chat/ChatList";
import { getAllChats } from "../services/operations/chatAPI";
import Button from "../components/Button";
import { getSocket } from "../context/SocketProvider";
import SendAttchments from "../components/core/Chat/SendAttchments";
import { useDispatch } from "react-redux";
import { removeNewMessagesAlert } from "../slices/chatSlice";

const Chat = () => {
  const { user, setLastChatWith } = getContextData();
  const socket = getSocket();
  const { id } = useParams();
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      const newMessage = {
        sender: user._id,
        receiver: id,
        content: content.trim(),
      };
      socket.emit("new_message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setContent("");
      setLastChatWith(id);
    }
  };

  const handleNewMessage = useCallback(
    (data) => {
      if (data.receiver === id || data.sender === id) {
        setMessages((prevMessages) => [...prevMessages, data]);
        socket.emit("message_seen", { senderId: user._id, receiverId: id });
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
    const result = await getAllChats(id);
    if (result) {
      setMessages(result.messages);
    }
  };

  useEffect(() => {
    if (id) {
      fetchChats();
      dispatch(removeNewMessagesAlert(id));
      socket.emit("message_seen", { senderId: user._id, receiverId: id });
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
    <section className="w-full h-full flex flex-col p-1 relative">
      <div className="h-[37rem] pb-1 overflow-y-auto">
        <ChatList messages={messages} userId={user._id} />
        <div ref={ref} />
      </div>
      <div className="form-style p-2 flex items-center gap-2 w-full">
        <SendAttchments setLastChatWith={setLastChatWith} id={id} />
        <form onSubmit={handleSubmit} className="flex gap-4 w-full">
          <div className="flex items-center w-full gap-2">
            <input
              type="text"
              name="content"
              className="bg-transparent w-full outline-none py-2"
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter Message"
              value={content}
              autoComplete="off"
            />
            <Button type="submit" customClass={"p-2 p rounded-full"}>
              <IoIosSend size={25} />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Chat;
