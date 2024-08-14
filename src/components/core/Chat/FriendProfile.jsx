import React from "react";
import Button from "../../Button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

const FriendProfile = ({ setBgImageIndex, bgArray }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get("username");
  const imageUrl = searchParams.get("imageUrl");

  return (
    <div className=" absolute right-0 top-0 flex justify-between w-full items-center p-2 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-white">
          <FaArrowLeftLong size={20} />
        </Link>

        <div className="flex gap-2 items-center text-white capitalize">
          <picture>
            <img
              src={imageUrl}
              alt="userImage"
              className="h-10 w-10 object-cover rounded-full"
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
