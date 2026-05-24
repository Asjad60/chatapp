import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  sendFriendRequest,
} from "../../services/operations/userAPI";
import { IoSearchOutline, IoClose, IoPersonAdd, IoCheckmark } from "react-icons/io5";

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
          prev.filter((u) =>
            u.username.trim().toLowerCase().includes(searchValue.trim().toLowerCase())
          )
        );
      } else {
        fetchUsers();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">Find People</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Search and send friend requests</p>
        </div>
        <button
          onClick={() => setSearchUser(false)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
        >
          <IoClose size={18} />
        </button>
      </div>

      {/* Search input */}
      <div className="relative flex items-center bg-white border border-slate-200 focus-within:border-[#0047e1] rounded-2xl px-3.5 py-2.5 transition-all duration-200 shadow-sm">
        <IoSearchOutline size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          placeholder="Search by username..."
          className="w-full bg-transparent outline-none border-none pl-2.5 text-slate-700 text-xs font-semibold placeholder:text-slate-400"
          autoFocus
        />
      </div>

      {/* User list */}
      <div className="flex flex-col gap-2 h-[300px] overflow-y-auto light-scrollbar pr-1">
        {users?.length > 0 ? (
          users.map((userr) => {
            const isAlreadyFriend = userr.friends.includes(user._id);
            return (
              <div
                className="flex gap-3 items-center p-3 bg-white border border-slate-200/70 rounded-2xl hover:border-slate-300 transition-all duration-200 chat-shadow-sm"
                key={userr._id}
              >
                <img
                  src={
                    typeof userr.image === "string"
                      ? userr.image
                      : userr.image.url
                  }
                  alt={`${userr.username}`}
                  className="w-9 h-9 object-cover rounded-full border border-slate-100 shrink-0"
                  loading="lazy"
                />
                <p className="capitalize text-xs font-bold text-slate-800 flex-1 truncate">
                  {userr.username}
                </p>
                <button
                  disabled={isAlreadyFriend}
                  onClick={() => handleSendFriendRequest(userr._id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                    isAlreadyFriend
                      ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                      : "bg-[#0047e1]/10 text-[#0047e1] border border-[#0047e1]/20 hover:bg-[#0047e1] hover:text-white hover:border-[#0047e1]"
                  }`}
                >
                  {isAlreadyFriend ? (
                    <>
                      <IoCheckmark size={12} />
                      Friends
                    </>
                  ) : (
                    <>
                      <IoPersonAdd size={12} />
                      Add
                    </>
                  )}
                </button>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <p className="text-xs text-slate-400 font-semibold">
              {searchValue ? "No users found" : "Loading users..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
