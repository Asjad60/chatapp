import React from "react";
import { Link } from "react-router-dom";

const FriendsLink = ({ friend, id, newMessageAlert }) => {
  return (
    <div className={`${id === friend._id && " bg-black/20"} p-2`}>
      <Link to={`/chat/${friend._id}`}>
        <div className="relative flex justify-between items-center">
          <div className={`flex gap-2 items-center`}>
            <picture>
              <img
                src={friend.image.url}
                alt={friend.username}
                className="w-[40px] h-[40px] object-cover rounded-full"
                loading="lazy"
              />
            </picture>
            <span className="capitalize text-sm">{friend.username}</span>
          </div>
          {newMessageAlert && (
            <span className="bg-[green]/30 rounded-full px-2 text-sm">
              {newMessageAlert.count}
            </span>
          )}
          <span
            className={`ml-2 h-2 w-2 rounded-full absolute -left-2 -top-1 ${
              friend.status === "online" ? "bg-green-500" : "hidden"
            }`}
          ></span>
        </div>
      </Link>
    </div>
  );
};

export default FriendsLink;
