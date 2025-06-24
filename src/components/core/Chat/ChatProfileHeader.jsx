import React, { forwardRef, useEffect, useRef, useState } from "react";
import Button from "../../Button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AnimatePresence, motion, stagger } from "framer-motion";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchGroupDetails } from "../../../services/operations/groupAPI";

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

    const containerVariants = {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.3,
        },
      },
    };

    const itemVariants = {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    };

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
          <img
            ref={imageRef}
            src={isUsernameParam ? imageUrl : groupDetails?.groupProfile}
            className="w-10 h-10 rounded-full object-cover "
          />
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

              {groupDetails && !isUsernameParam && (
                <div className="mt-[16rem] min-[480px]:mt-[22rem]">
                  <div>
                    <h3 className={"text-2xl text-center  font-bold"}>
                      {groupDetails?.groupName}
                    </h3>
                    <span className="text-xs p-2">
                      Total members: {groupDetails?.members?.length}
                    </span>
                  </div>
                  <motion.div
                    className=" space-y-4 p-4 divide-y divide-slate-400/40"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {groupDetails?.members?.map((member) => (
                      <motion.div
                        key={member._id}
                        variants={itemVariants}
                        className="flex justify-between"
                      >
                        <div className="flex gap-4 items-center pt-2">
                          <img
                            src={member?.image.url}
                            alt={member?.username}
                            className="object-cover w-[40px] h-[40px] rounded-full"
                          />
                          <span className="text-slate-100">
                            {member.username}{" "}
                            {userId === member?._id && "(You)"}
                          </span>
                        </div>
                        {member?._id === groupDetails?.admin?._id && (
                          <span className="p-1 text-xs bg-[#255487] h-fit rounded-md mt-3 text-slate-100">
                            Admin
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
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
