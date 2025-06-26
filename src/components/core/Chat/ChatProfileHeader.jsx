import React, { forwardRef, useEffect, useRef, useState } from "react";
import Button from "../../Button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchGroupDetails } from "../../../services/operations/groupAPI";
import { FaLongArrowAltLeft } from "react-icons/fa";
import GroupMembers from "./GroupMembers";

const ChatProfileHeader = forwardRef(
  ({ setBgImageIndex, bgArray, userId }, containerRef) => {
    const [searchParams] = useSearchParams();
    const username = searchParams.get("username");
    const imageUrl = searchParams.get("imageUrl");
    const isUsernameParam = searchParams.has("username");
    const { id: groupId } = useParams();

    const [groupDetails, setGroupDetails] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [imagePos, setImagePos] = useState(null);

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
          const res = await fetchGroupDetails(groupId);
          if (res) {
            setGroupDetails(res.data);
          }
        }
      })();

      if (isOpen) {
        setIsOpen(false);
      }
    }, [groupId]);

    useEffect(() => {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };

      handleResize(); // initial run

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = screenWidth <= 480;
    const animatedSize = isMobile ? 200 : 300;
    const left = containerWidth / 2 - animatedSize / 2;

    // console.log("groupDetails: ", groupDetails);

    return (
      <div className="flex justify-between w-full items-center bg-gray-900 z-20">
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
          <h2>{isUsernameParam ? username : groupDetails?.groupName}</h2>
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
                  initial={{
                    position: "absolute",
                    top: imagePos.y,
                    left: imagePos.x,
                    width: imagePos.width,
                    height: imagePos.height,
                    borderRadius: "9999px",
                  }}
                  animate={{
                    //   top: imagePos.containerHeight / 2 - 150, // center vertically in parent
                    left: left, // center horizontally in parent
                    width: animatedSize,
                    height: animatedSize,
                    borderRadius: "9999px",
                  }}
                  exit={{
                    top: imagePos.y,
                    left: imagePos.x,
                    width: imagePos.width,
                    height: imagePos.height,
                    borderRadius: "9999px",
                  }}
                  transition={{ duration: 0.4 }}
                  onClick={(e) => e.stopPropagation()}
                  className="object-cover"
                />
              ) : (
                <motion.div
                  initial={{
                    position: "absolute",
                    top: imagePos.y,
                    left: imagePos.x,
                    width: imagePos.width,
                    height: imagePos.height,
                    borderRadius: "9999px",
                  }}
                  animate={{
                    //   top: imagePos.containerHeight / 2 - 150, // center vertically in parent
                    left: left, // center horizontally in parent
                    width: animatedSize,
                    height: animatedSize,
                    borderRadius: "9999px",
                  }}
                  exit={{
                    top: imagePos.y,
                    left: imagePos.x,
                    width: imagePos.width,
                    height: imagePos.height,
                    borderRadius: "9999px",
                  }}
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

        <details title="Wallpapers">
          <summary className="details float-end text-white active:opacity-45 cursor-pointer">
            <BsThreeDotsVertical size={25} />
          </summary>

          <div className="flex flex-col min-[375px]:flex-row max-w-max gap-1 absolute min-[375px]:static right-2 top-14">
            {bgArray.map((imgURL, i) => (
              <Button
                key={i}
                type="button"
                customClass={"bg-transparent "}
                onClick={() => {
                  setBgImageIndex(i);
                  localStorage.setItem("bg-wallpaper", JSON.stringify(i));
                }}
              >
                <picture>
                  <img
                    src={imgURL}
                    alt={"background-wallpaper"}
                    className="object-cover w-6 h-6 rounded-full"
                  />
                </picture>
              </Button>
            ))}
          </div>
        </details>
      </div>
    );
  }
);

export default ChatProfileHeader;
