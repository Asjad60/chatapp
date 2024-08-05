import React, { useEffect, useState } from "react";
import { AiFillMinusCircle } from "react-icons/ai";
import { BsFillPlusCircleFill } from "react-icons/bs";
import {
  getAllUsers,
  sendFriendRequest,
} from "../../services/operations/userAPI";
import Button from "../Button";
import { GiCrossedBones } from "react-icons/gi";

const SearchUsers = ({ user, searchUser, setSearchUser, users, setUsers }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSendFriendRequest = async (requestedUserId) => {
    await sendFriendRequest(requestedUserId);
  };

  const fetchUsers = async () => {
    const res = await getAllUsers();
    if (res) {
      setUsers(res.users);
    }
    // console.log("fetching userd => ", res);
  };

  useEffect(() => {
    if (searchUser && users?.length === 0) {
      fetchUsers();
    }
  }, [searchUser, users?.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue) {
        setUsers((prev) =>
          prev.filter((user) =>
            user.username
              .trim()
              .toLowerCase()
              .includes(searchValue.trim().toLowerCase())
          )
        );
      } else {
        fetchUsers();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <div className=" absolute -left-2/4 min-[400px]:-left-[100%] top-12 z-10 max-w-[300px] rounded-lg p-1 border border-gray-600/30">
      <div className="flex justify-end mb-5">
        <Button onClick={() => setSearchUser(false)} customClass={"p-1"}>
          <GiCrossedBones size={20} />
        </Button>
      </div>
      <input
        type="text"
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search user"
        className="form-style mb-10"
      />

      <div className="flex flex-col gap-y-4 h-[210px] overflow-y-auto">
        {users?.map((userr) => (
          <div
            className={`flex gap-2 items-center relative p-1`}
            key={userr._id}
          >
            <picture className="w-[65px] h-[40px]">
              <img
                src={
                  typeof userr.image === "string"
                    ? userr.image
                    : userr.image.url
                }
                alt={`${userr.username}-img`}
                className="w-[100%] h-[100%] object-cover rounded-full"
                loading="lazy"
              />
            </picture>
            <p className="capitalize text-sm w-full">{userr.username}</p>
            <Button
              disabled={userr.friends.includes(user._id)}
              onClick={() => handleSendFriendRequest(userr._id)}
              customClass={`p-2 ${
                userr.friends.includes(user._id) && "opacity-50"
              }`}
            >
              {userr.friends?.length > 0 &&
              userr.friends?.includes(user._id) ? (
                <AiFillMinusCircle size={20} />
              ) : (
                <BsFillPlusCircleFill size={20} />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;
