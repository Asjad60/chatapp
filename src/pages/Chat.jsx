import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getContextData } from "../context/AuthProvider";
import { IoIosSend } from "react-icons/io";
import { IoHappyOutline } from "react-icons/io5";
import ChatList from "../components/core/Chat/ChatList";
import { getAllChats, sendAttachments } from "../services/operations/chatAPI";
import Button from "../components/Button";
import { getSocket } from "../context/SocketProvider";
import SendAttchments from "../components/core/Chat/SendAttchments";
import { useDispatch } from "react-redux";
import { removeNewMessagesAlert } from "../slices/chatSlice";
import ChatProfileHeader from "../components/core/Chat/ChatProfileHeader";
import { fetchGroupMessages } from "../services/operations/groupAPI";
import { toast } from "react-hot-toast";
import messageSound from "../assets/message-sound.mp3";
import { RiVoiceRecognitionFill } from "react-icons/ri";
import { FaMicrophone, FaTrash, FaCheck } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react"
import AudioPlayer from "../components/core/Chat/AudioPlayer";

const Chat = () => {
  const { user, setLastChatWith } = getContextData();
  const [loading, setLoading] = useState(false);
  const socket = getSocket();
  const { id } = useParams();
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [paginationData, setPaginationData] = useState({ hasNextPage: false });
  const [typingUsers, setTypingUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const [recordedFile, setRecordedFile] = useState(null);

  const [searchParams] = useSearchParams();
  const isGroupName = searchParams.has("groupname");

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainer = useRef(null);
  const recognitionRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const isCancelRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click was outside picker and outside the trigger button
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(".emoji-trigger-btn")
      ) {
        setIsEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [audioPreviewUrl]);



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
      inputRef.current.focus();
    }
  };

  const isUserAtBottom = () => {
    if (!chatContainer.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = chatContainer.current;
    return scrollHeight - scrollTop - clientHeight < 150;
  };

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNewMessage = useCallback(
    (data) => {
      if (!isGroupName) {
        if (data.receiver === id || data.sender === id) {
          setMessages((prevMessages) => [...prevMessages, data]);
          socket.emit("message_seen", { senderId: user._id, receiverId: id });
          if (data.sender === id) new Audio(messageSound).play();
        }
      } else if (isGroupName && data.group === id) {
        setMessages((prevMessages) => [...prevMessages, data]);
        if (data.sender === id) new Audio(messageSound).play();
      }
    },
    [id, user._id, isGroupName]
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
    [id]
  );

  const fetchChats = async (pageNumber = 1) => {
    const container = chatContainer.current;
    const prevScrollHeight = container?.scrollHeight;

    if (!isGroupName) {
      const result = await getAllChats(id, pageNumber, 30);
      if (result) {
        if (pageNumber === 1) {
          setMessages(result.messages || []);
        } else {
          setMessages((prev) => {
            const existingIds = new Set((prev || []).map((msg) => msg?._id));
            const newMessages = (result?.messages || []).filter(
              (msg) => msg && !existingIds.has(msg._id)
            );
            return [...newMessages, ...(prev || [])];
          });
        }
        setPaginationData(result.pagination || { hasNextPage: false });
      }
    } else {
      const result = await fetchGroupMessages(id, pageNumber, 30);
      if (result) {
        if (pageNumber === 1) {
          setMessages(result.messages || []);
        } else {
          setMessages((prev) => {
            const existingIds = new Set((prev || []).map((msg) => msg?._id));
            const newMessages = result?.messages?.filter(
              (msg) => msg && !existingIds.has(msg._id)
            ) || [];
            return [...newMessages, ...(prev || [])];
          });
        }
        setPaginationData(result.pagination || { hasNextPage: false });
      }
    }

    setTimeout(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - prevScrollHeight;
      }
    }, 50);
  };

  const handleOnUserTyping = useCallback(
    (data) => {
      const { sender, isTyping, username, groupId } = data;
      if (isGroupName && groupId === id) {
        setTypingUsers((prev) => {
          if (isTyping) {
            return prev.includes(username) ? prev : [...prev, username];
          } else {
            return prev.filter((user) => user !== username);
          }
        });
      } else if (!isGroupName && id === sender) {
        setTypingUsers(isTyping ? [sender] : []);
      }
    },
    [id, isGroupName]
  );

  const handleTypeMessage = () => {
    if (socket) {
      let obj = { isTyping: true };
      if (isGroupName) obj.groupId = id;
      if (!isGroupName) obj.receiverId = id;
      socket.emit("typing", obj);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { ...obj, isTyping: false });
      }, 500);
    }
  };

  useEffect(() => {
    if (id) {
      setPage(1);
      setMessages([]);
      setPaginationData({ hasNextPage: false });
      fetchChats(1).then(()=> scrollToBottom());
      dispatch(removeNewMessagesAlert(id));
      socket.emit("message_seen", { senderId: user._id, receiverId: id });
      inputRef.current.focus();
    }
    if (isGroupName) socket.emit("join_room", { groupId: id });
  }, [id, isGroupName, user._id, socket, dispatch]);

  useEffect(() => {
    if (page > 1) {
      fetchChats(page);
    }
  }, [page]);

  useEffect(() => {
    socket.on("user-typing", handleOnUserTyping);
    socket.on("new_message", handleNewMessage);
    socket.on("message_seen", handleMessageSeen);
    return () => {
      socket.off("user-typing", handleOnUserTyping);
      socket.off("new_message", handleNewMessage);
      socket.off("message_seen", handleMessageSeen);
      if (isGroupName) socket.emit("leave_room", { groupId: id });
    };
  }, [socket, handleOnUserTyping, handleNewMessage, handleMessageSeen, id, isGroupName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  useEffect(() => {
    if (!chatContainer.current) return;
    const container = chatContainer.current;

    const ChatContainerScroll = () => {
      if (paginationData.hasNextPage && container.scrollTop === 0) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", ChatContainerScroll);

    return () => {
      container.removeEventListener("scroll", ChatContainerScroll);
    };
  }, [paginationData.hasNextPage]);

  const handleSpeechToText = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setContent(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Speech recognition not supported:', error);
      toast.error('Speech recognition not supported in this browser');
      setIsListening(false);
    }
  }, [isListening]);

  const startRecording = async () => {
    if (!window.MediaRecorder || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Microphone recording not supported on this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const getSupportedMimeType = () => {
        const types = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/mp4",
          "audio/ogg",
          "audio/wav",
          "audio/aac"
        ];
        if (!window.MediaRecorder.isTypeSupported) {
          return "";
        }
        for (const type of types) {
          if (window.MediaRecorder.isTypeSupported(type)) {
            return type;
          }
        }
        return "";
      };

      const detectedMimeType = getSupportedMimeType();
      const options = detectedMimeType ? { mimeType: detectedMimeType } : {};
      const recorder = new window.MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      isCancelRef.current = false;
      
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (!isCancelRef.current && chunks.length > 0) {
          const actualMimeType = recorder.mimeType || detectedMimeType || "audio/webm";
          const blob = new Blob(chunks, { type: actualMimeType });
          const extension = actualMimeType.split("/")[1]?.split(";")[0] || "webm";
          const file = new File([blob], `voice_message.${extension}`, { type: actualMimeType });
          
          if (audioPreviewUrl) {
            URL.revokeObjectURL(audioPreviewUrl);
          }
          const previewUrl = URL.createObjectURL(blob);
          setAudioPreviewUrl(previewUrl);
          setRecordedFile(file);
          setIsPreviewing(true);
        }
      };

      recorder.start();
      setIsRecording(true);
      
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access microphone");
    }
  };

  const stopRecordingAndPreview = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      isCancelRef.current = false;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      isCancelRef.current = true;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      setAudioPreviewUrl("");
      setRecordedFile(null);
      setIsPreviewing(false);
      toast.error("Recording canceled");
    }
  };

  const discardPreview = () => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioPreviewUrl("");
    setRecordedFile(null);
    setIsPreviewing(false);
    toast.error("Recording discarded");
  };

  const sendPreviewRecording = async () => {
    if (!recordedFile) return;

    const formData = new FormData();
    formData.append("files", recordedFile);
    if (isGroupName) {
      formData.append("groupId", id);
    } else {
      formData.append("receiverId", id);
    }

    const toastId = toast.loading("Sending voice message...");
    try {
      const response = await sendAttachments(formData);
      if (response && response.success) {
        setLastChatWith(id);
        toast.success("Voice message sent", { id: toastId });
      } else {
        toast.error("Failed to send voice message", { id: toastId });
      }
    } catch (err) {
      console.error("Audio message sending failed:", err);
      toast.error("Failed to send voice message", { id: toastId });
    } finally {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      setAudioPreviewUrl("");
      setRecordedFile(null);
      setIsPreviewing(false);
    }
  };

  const formatRecordingTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };


  return (
    <section
      className="w-full h-full flex flex-col dotted-bg font-comfortaa overflow-hidden relative"
      ref={containerRef}
    >
      {/* Header Profile Bar */}
      <ChatProfileHeader ref={containerRef} userId={user._id} />

      {/* Messages Panel Container */}
      <div
        className="flex-grow overflow-y-auto py-6 light-scrollbar relative z-10"
        ref={chatContainer}
      >
        {!loading ? (
          <>
            <ChatList messages={messages} userId={user._id} />

            {/* Dynamic typing indicator card */}
            {typingUsers.length > 0 && (
              <div className="p-3 bg-white border border-slate-100 rounded-2xl chat-shadow-sm w-fit mt-4 ml-6 flex items-center gap-3">
                {typingUsers?.map((u, i) => (
                  <div className="flex items-center gap-2" key={i}>
                    {isGroupName && (
                      <span className="font-bold text-[#0047e1] text-[10px]">
                        {u} is typing
                      </span>
                    )}
                    {!isGroupName && (
                      <span className="font-bold text-[#0047e1] text-[10px]">
                        Typing
                      </span>
                    )}
                  </div>
                ))}
                <div className="light-typing-loader"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="loader !border-[#0047e1]"></div>
          </div>
        )}
        <div ref={ref} />
      </div>

      {/* Footer Text Bar */}
      <div className="p-4 bg-transparent w-full flex items-center gap-3 shrink-0 z-10">
        {!isRecording && !isPreviewing && (
          /* Attachment upload selector */
          <SendAttchments setLastChatWith={setLastChatWith} id={id} />
        )}

        {isRecording ? (
          <div className="flex-grow flex items-center justify-between gap-3 bg-white rounded-2xl px-4 py-2 border border-slate-100 chat-shadow-md animate-pulse">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-slate-700 text-sm font-bold animate-pulse">
                Recording Voice Message...
              </span>
              <span className="text-[#0047e1] text-sm font-extrabold font-mono ml-1">
                {formatRecordingTime(recordingTime)}
              </span>
            </div>
            
            <div className="flex items-center gap-2.5">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={cancelRecording}
                className="h-9 w-9 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
                title="Discard Recording"
              >
                <FaTrash size={14} />
              </button>

              {/* Stop & Preview Button */}
              <button
                type="button"
                onClick={stopRecordingAndPreview}
                className="h-9 w-9 rounded-full flex items-center justify-center bg-[#0047e1] text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shadow-md shadow-blue-500/10"
                title="Stop & Preview"
              >
                <FaCheck size={14} />
              </button>
            </div>
          </div>
        ) : isPreviewing ? (
          <div className="flex-grow flex items-center justify-between gap-3 bg-white rounded-2xl px-4 py-2 border border-slate-100 chat-shadow-md">
            <div className="flex-grow flex items-center gap-3 min-w-0">
              <AudioPlayer url={audioPreviewUrl} />
            </div>
            
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Discard Preview Button */}
              <button
                type="button"
                onClick={discardPreview}
                className="h-9 w-9 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
                title="Discard Preview"
              >
                <FaTrash size={14} />
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={sendPreviewRecording}
                className="h-9 w-9 rounded-full flex items-center justify-center bg-[#0047e1] text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shadow-md shadow-blue-500/10"
                title="Send Voice Message"
              >
                <IoIosSend size={18} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex gap-3">
            {/* Main message input pill */}
            <div className="flex-grow relative flex items-center bg-white rounded-2xl px-4 py-2 border border-slate-100 chat-shadow-md">
              <input
                type="text"
                name="content"
                className="w-full bg-transparent outline-none border-none py-1.5 text-slate-800 text-sm font-semibold placeholder:text-slate-400"
                onChange={(e) => {
                  setContent(e.target.value);
                  handleTypeMessage();
                }}
                placeholder={
                  isListening ? "Listening... Speak now..." : "Type a message..."
                }
                value={content}
                autoComplete="off"
                ref={inputRef}
              />

              {/* Speech to text button */}
              <button
                type="button"
                onClick={handleSpeechToText}
                className={`p-1 rounded-xl transition-all duration-150 cursor-pointer shrink-0 ${
                  isListening
                    ? "text-red-500 bg-red-50 ring-2 ring-red-500/20 animate-pulse"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
                title={isListening ? "Stop Listening" : "Voice Input"}
              >
                <RiVoiceRecognitionFill size={20} />
              </button>

              {/* Voice recording trigger button */}
              <button
                type="button"
                onClick={startRecording}
                className="p-1 text-slate-400 hover:text-[#0047e1] transition-colors duration-150 cursor-pointer shrink-0"
                title="Record Voice Note"
              >
                <FaMicrophone size={18} />
              </button>

              {/* Emoji Trigger */}
              <button
                type="button"
                onClick={() => setIsEmojiOpen((prev) => !prev)}
                className="emoji-trigger-btn p-1 text-slate-400 hover:text-slate-600 transition-colors duration-150 cursor-pointer shrink-0"
                title="Add Emoji"
              >
                <IoHappyOutline size={20} />
              </button>

              {/* Float EmojiPicker absolutely above input pill on right side */}
              {isEmojiOpen && (
                <div 
                  ref={emojiPickerRef} 
                  className="absolute bottom-[calc(100%+12px)] right-3 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-100/80 animate-fade-in"
                >
                  <EmojiPicker
                    onEmojiClick={(emojiObject) =>
                      setContent((prev) => prev + emojiObject.emoji)
                    }
                    emojiStyle="native"
                    open={isEmojiOpen}
                    // previewConfig={{ showPreview: false }}
                    lazyLoadEmojis={true}
                    theme="light"
                  />
                </div>
              )}

            </div>

            {/* Paperplane Circular Send Trigger */}
            <button
              type="submit"
              className="h-11 w-11 shrink-0 rounded-full bg-[#0047e1] text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-md shadow-blue-500/10 cursor-pointer"
              title="Send Message"
            >
              <IoIosSend size={20} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Chat;
