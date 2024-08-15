import React, { useState, useCallback, useEffect } from "react";
import Button from "../../Button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

const FriendProfile = ({ setBgImageIndex, bgArray }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get("username");
  const imageUrl = searchParams.get("imageUrl");
  const [isImageFull, setIsImageFull] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = useCallback(
    (e) => {
      const y = e.clientY || e.touches[0].clientY;
      if (isImageFull) {
        setStartPosition(y);
        setIsDragging(true);
      }
    },
    [isImageFull]
  );

  const handleMove = useCallback(
    (e) => {
      if (isDragging) {
        const y = e.clientY || e.touches[0].clientY;
        const distance = y - startPosition;
        const maxDragDistance = 100;
        setDragPosition(Math.min(distance, maxDragDistance));
      }
    },
    [isDragging, startPosition]
  );

  const handleEnd = useCallback(() => {
    if (isDragging) {
      if (dragPosition > 50) {
        setIsImageFull(false);
      }
      setDragPosition(0);
      setIsDragging(false);
    }
  }, [isDragging, dragPosition]);

  useEffect(() => {
    if (isImageFull) {
      setIsImageFull(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleEnd);
    } else {
      window.removeEventListener("mouseup", handleEnd);
    }

    return () => {
      window.removeEventListener("mouseup", handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div className="flex justify-between w-full items-center p-2 bg-black/50 backdrop-blur-sm z-20 relative">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-white">
          <FaArrowLeftLong size={20} />
        </Link>

        <div className="flex gap-2 items-center text-white capitalize">
          <picture
            onClick={() => setIsImageFull(true)}
            className={`${
              isImageFull
                ? "absolute inset-0 h-[75vh] bg-black/90 flex justify-center items-center"
                : "relative"
            }`}
            onMouseDown={(e) => e.button === 0 && handleStart(e)}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            <img
              src={imageUrl}
              alt="userImage"
              style={{
                transform: isDragging
                  ? `translateY(${dragPosition}px)`
                  : "translateY(0)",
                // transition: isDragging ? "none" : "transform 0.3s ease-out",
              }}
              className={`object-cover rounded-full transition-all duration-200 select-none ${
                isImageFull
                  ? "w-11/12 min-[400px]:w-2/3 aspect-square rounded-none "
                  : "w-10 h-10"
              }`}
              draggable={false}
            />
          </picture>
          <span>{username}</span>
        </div>
      </div>
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
};

export default FriendProfile;
