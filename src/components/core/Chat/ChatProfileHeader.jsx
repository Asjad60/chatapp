import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchGroupDetails } from "../../../services/operations/groupAPI";
import GroupMembers from "./GroupMembers";
import { getSocket } from "../../../context/SocketProvider";
import {
  IoArrowBack,
  IoEllipsisVertical,
  IoPersonOutline,
} from "react-icons/io5";

const ChatProfileHeader = forwardRef(({ userId }, containerRef) => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const imageUrl = searchParams.get("imageUrl");
  const isUsernameParam = searchParams.has("username");
  const { id: chatId } = useParams();
  const socket = getSocket();

  const [groupDetails, setGroupDetails] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [imagePos, setImagePos] = useState(null);
  const [status, setStatus] = useState({
    totalOnlineUsers: 0,
    userStatus: "offline",
  });

  // Cache the latest online-user set so we can apply it immediately
  // after mount without waiting for the next broadcast.
  const onlineUsersRef = useRef(new Set());

  const imageRef = useRef();

  const openZoom = () => {
    if (imageRef.current && containerRef.current) {
      const imageRect = imageRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setImagePos({
        x: imageRect.left - containerRect.left,
        y: imageRect.top - containerRect.top,
        width: imageRect.width,
        height: imageRect.height,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height,
      });

      setIsOpen(true);
    }
  };

  const closeZoom = () => setIsOpen(false);

  useEffect(() => {
    (async () => {
      if (searchParams.has("groupname")) {
        const res = await fetchGroupDetails(chatId);
        if (res) {
          setGroupDetails(res.data);
        }
      }
    })();

    if (isOpen) {
      setIsOpen(false);
    }
  }, [chatId]);

  const applyOnlineStatus = useCallback(
    (onlineUsers) => {
      if (isUsernameParam) {
        const userOnline = onlineUsers.has(chatId);
        setStatus((prev) => ({
          ...prev,
          userStatus: userOnline ? "online" : "offline",
        }));
      } else {
        if (!groupDetails?.members) return;
        const totalOnlineUsersInGroup = groupDetails.members
          .filter((member) => member?._id && member._id !== userId)
          .reduce(
            (acc, member) => (onlineUsers.has(member._id) ? acc + 1 : acc),
            0,
          );
        setStatus({
          totalOnlineUsers: totalOnlineUsersInGroup,
          userStatus: totalOnlineUsersInGroup > 0 ? "online" : "offline",
        });
      }
    },
    [chatId, groupDetails, userId, isUsernameParam],
  );

  const handleUserStatus = useCallback(
    (data) => {
      const onlineUsers = new Set(data);
      onlineUsersRef.current = onlineUsers; // keep ref up-to-date
      applyOnlineStatus(onlineUsers);
    },
    [applyOnlineStatus],
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    socket.on("user_status", handleUserStatus);

    // Request a fresh snapshot immediately so the header doesn't start
    // as "Offline" waiting for the next broadcast.
    socket.emit("get_online_users");

    return () => {
      socket.off("user_status", handleUserStatus);
    };
  }, [handleUserStatus, chatId, socket]);

  // When chatId or groupDetails change, re-apply the cached status
  // instead of waiting for the next broadcast.
  useEffect(() => {
    if (onlineUsersRef.current.size > 0) {
      applyOnlineStatus(onlineUsersRef.current);
    }
  }, [chatId, applyOnlineStatus]);

  const isMobile = screenWidth <= 480;
  const animatedSize = isMobile ? 200 : 300;
  const left = containerWidth / 2 - animatedSize / 2;

  const initialMotionImgStyle = {
    position: "absolute",
    top: imagePos?.y,
    left: imagePos?.x,
    width: imagePos?.width,
    height: imagePos?.height,
    borderRadius: "9999px",
  };

  const animateMotionImgStyle = {
    left: left,
    width: animatedSize,
    height: animatedSize,
    borderRadius: "9999px",
  };

  const exiteMotionImgStyle = {
    top: imagePos?.y,
    left: imagePos?.x,
    width: imagePos?.width,
    height: imagePos?.height,
    borderRadius: "9999px",
  };

  const isOnline = status.userStatus === "online";

  return (
    <div className="flex justify-between w-full items-center bg-white border-b border-slate-100 p-4 shrink-0 font-comfortaa chat-shadow-sm z-20">
      {/* Left Area: Profile Avatar & Details */}
      <div className="flex items-center gap-3">
        {/* Back Link - Only visible on mobile screen widths */}
        <Link
          to="/"
          className="p-2 rounded-xl bg-white border border-slate-200/60 text-slate-500 hover:text-[#0047e1] hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 chat-shadow-sm"
        >
          <IoArrowBack size={18} />
        </Link>

        {/* Profile Avatar Clickable to Zoom */}
        <div onClick={openZoom} className="relative cursor-pointer shrink-0">
          {isUsernameParam || groupDetails?.groupProfile ? (
            <img
              ref={imageRef}
              src={isUsernameParam ? imageUrl : groupDetails?.groupProfile}
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100"
              alt="Avatar"
            />
          ) : (
            <div
              ref={imageRef}
              className="capitalize font-bold text-sm rounded-full bg-blue-600/10 text-blue-600 w-10 h-10 flex justify-center items-center"
            >
              {groupDetails?.groupName ? groupDetails?.groupName[0] : "?"}
            </div>
          )}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* User Info Details */}
        <div className="flex flex-col">
          <h2 className="text-slate-800 font-extrabold text-xs leading-normal">
            {isUsernameParam ? username : groupDetails?.groupName}
          </h2>
          <div className="flex items-center gap-1 mt-0.5">
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span>
                <span className="text-[10px] text-green-500 font-bold">
                  Active now
                </span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0"></span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Offline
                </span>
              </>
            )}
            {!isUsernameParam && status.totalOnlineUsers > 0 && (
              <span className="text-[9px] text-blue-500 font-bold ml-1">
                ({status.totalOnlineUsers} online)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Area: View Profile Dash-Button & More Menu */}
      <div className="flex items-center gap-3">
        {/* View Profile pill button */}
        <button
          onClick={openZoom}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/50 hover:bg-blue-50 border border-blue-200 border-dashed rounded-full text-blue-600 font-bold text-[10px] transition-all duration-200 cursor-pointer shadow-sm"
        >
          <IoPersonOutline size={12} className="shrink-0" />
          <span className="hidden sm:inline">View Profile</span>
        </button>

        {/* Ellipsis menu button */}
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors duration-150 cursor-pointer shrink-0">
          <IoEllipsisVertical size={16} />
        </button>
      </div>

      {/* Zoomed Image & Group Details Modal Overlay */}
      <AnimatePresence>
        {isOpen && imagePos && (
          <motion.div
            className="absolute inset-0 bg-black/60 text-slate-100 backdrop-blur-sm z-50 flex flex-col overflow-y-auto"
            onClick={closeZoom}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="my-auto py-10 flex flex-col items-center justify-center">
              {isUsernameParam || groupDetails?.groupProfile ? (
                <motion.img
                  src={isUsernameParam ? imageUrl : groupDetails?.groupProfile}
                  initial={initialMotionImgStyle}
                  animate={animateMotionImgStyle}
                  exit={exiteMotionImgStyle}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="object-cover shadow-2xl border border-white/20"
                />
              ) : (
                <motion.div
                  initial={initialMotionImgStyle}
                  animate={animateMotionImgStyle}
                  exit={exiteMotionImgStyle}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="capitalize text-6xl font-bold rounded-full bg-blue-600 text-white w-[300px] h-[300px] flex justify-center items-center shadow-2xl"
                >
                  {groupDetails?.groupName ? groupDetails?.groupName[0] : "?"}
                </motion.div>
              )}

              {groupDetails && !isUsernameParam && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-sm mt-6"
                >
                  <GroupMembers groupDetails={groupDetails} userId={userId} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ChatProfileHeader;
