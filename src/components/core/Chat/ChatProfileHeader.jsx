import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// import Button from "../../Button";
// import { BsThreeDotsVertical } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchGroupDetails } from "../../../services/operations/groupAPI";
import { FaLongArrowAltLeft } from "react-icons/fa";
import GroupMembers from "./GroupMembers";
import { getSocket } from "../../../context/SocketProvider";

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

  const handleUserStatus = useCallback(
    async (data) => {
      const onlineUsers = new Set(data);
      if (isUsernameParam) {
        if (onlineUsers.has(chatId)) {
          setStatus((prev) => ({ ...prev, userStatus: "online" }));
        } else {
          setStatus((prev) => ({ ...prev, userStatus: "offline" }));
        }
      } else {
        if (!groupDetails?.members) return;

        const totalOnlineUsersInGroup = groupDetails.members
          .filter((member) => member?._id && member._id !== userId)
          .reduce(
            (acc, member) => (onlineUsers.has(member._id) ? acc + 1 : acc),
            0
          );

        setStatus({
          totalOnlineUsers: totalOnlineUsersInGroup,
          userStatus: totalOnlineUsersInGroup > 0 ? "online" : "offline",
        });
      }
    },
    [chatId, groupDetails, userId, isUsernameParam]
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

    return () => {
      socket.off("user_status", handleUserStatus);
    };
  }, [handleUserStatus, chatId]);

  const isMobile = screenWidth <= 480;
  const animatedSize = isMobile ? 200 : 300;
  const left = containerWidth / 2 - animatedSize / 2;

  // console.log("groupDetails: ", groupDetails);

  const initialMotionImgStyle = {
    position: "absolute",
    top: imagePos?.y,
    left: imagePos?.x,
    width: imagePos?.width,
    height: imagePos?.height,
    borderRadius: "9999px",
  };

  const animateMotionImgStyle = {
    //   top: imagePos?.containerHeight / 2 - 150, // center vertically in parent
    left: left, // center horizontally in parent
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

  return (
    <div className="flex justify-between w-full items-center bg-gradient-to-br to-[#000]  from-[#192e3b] z-20">
      <div
        className="flex items-center gap-3 p-4 text-white cursor-pointer"
        onClick={openZoom}
      >
        <Link to="/" className="text-slate-300">
          <FaLongArrowAltLeft size={25} />
        </Link>
        {isUsernameParam || groupDetails?.groupProfile ? (
          <img
            ref={imageRef}
            src={isUsernameParam ? imageUrl : groupDetails?.groupProfile}
            className="w-10 h-10 rounded-full object-cover "
          />
        ) : (
          <div
            ref={imageRef}
            className="capitalize p-2 rounded-full bg-[#255487] w-[40px] h-[40px] flex justify-center items-center"
          >
            {groupDetails?.groupName[0]}
          </div>
        )}
        <div className="flex flex-col">
          <h2>{isUsernameParam ? username : groupDetails?.groupName}</h2>
          <span
            className={`text-xs ${
              status.userStatus === "online" ? "text-green-600" : "text-red-400"
            }`}
          >
            {!isUsernameParam &&
              status.totalOnlineUsers > 0 &&
              status.totalOnlineUsers}{" "}
            {status.userStatus}
          </span>
        </div>
      </div>

      {/* Zoomed Image */}
      <AnimatePresence>
        {isOpen && imagePos && (
          <motion.div
            className="absolute inset-0 bg-black text-slate-100 bg-opacity-60 backdrop-blur-sm z-50 flex flex-col overflow-y-auto"
            onClick={closeZoom}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isUsernameParam || groupDetails?.groupProfile ? (
              <motion.img
                src={isUsernameParam ? imageUrl : groupDetails?.groupProfile}
                initial={initialMotionImgStyle}
                animate={animateMotionImgStyle}
                exit={exiteMotionImgStyle}
                transition={{ duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="object-cover"
              />
            ) : (
              <motion.div
                initial={initialMotionImgStyle}
                animate={animateMotionImgStyle}
                exit={exiteMotionImgStyle}
                transition={{ duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="capitalize text-6xl p-2 rounded-full bg-[#255487] w-[40px] h-[40px] flex justify-center items-center"
              >
                {groupDetails?.groupName[0]}
              </motion.div>
            )}

            {groupDetails && !isUsernameParam && (
              <GroupMembers groupDetails={groupDetails} userId={userId} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ChatProfileHeader;
