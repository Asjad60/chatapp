import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getContextData } from "../../context/AuthProvider";
import { logoutUser } from "../../services/operations/authAPI";
import { IoNotifications } from "react-icons/io5";
import Button from "../Button";
import { getSocket } from "../../context/SocketProvider";
import { IoIosLogOut, IoIosSearch } from "react-icons/io";
import SearchUsers from "./SearchUsers";
import TextHighlighter from "../TextHighlighter";
import { GrGroup } from "react-icons/gr";
import CreateGroup from "./group/CreateGroup";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [users, setUsers] = useState([]);
  const { token, setToken, user, notifications } = getContextData();
  const socket = getSocket();

  const handleLogout = async () => {
    await logoutUser(token, setToken, navigate);
    socket.disconnect();
  };

  return (
    <nav className="rounded-t-lg relative max-w-[900px] w-full flex justify-between items-start border border-gray-600/30 p-2">
      {/* <h1 className="text-4xl font-extrabold font-inter uppercase">
        Chit Chat
      </h1> */}

      <TextHighlighter
        text={"Chit Chat"}
        tag={"h1"}
        customClass={"!text-4xl !font-[900]"}
      />

      <div className=" flex gap-2 items-center flex-wrap">
        <div className="relative">
          <Button
            onClick={() => {
              setSearchUser(true);
              if (isCreatingGroup) setIsCreatingGroup(false);
            }}
            customClass={"p-2"}
            title="Search User"
          >
            <IoIosSearch size={25} />
          </Button>
          {searchUser && (
            <SearchUsers
              user={user}
              users={users}
              setUsers={setUsers}
              searchUser={searchUser}
              setSearchUser={setSearchUser}
            />
          )}
        </div>

        <Button customClass={"p-2"} title="Notifications">
          <Link to={"/notification"} className="relative">
            <IoNotifications size={25} />
            {notifications?.filter((item) => !item.read).length > 0 && (
              <span className="absolute -bottom-2 -right-1 text-[.6rem] py-0.5 px-1.5 rounded-full bg-red-500">
                {notifications?.filter((item) => !item.read).length}
              </span>
            )}
          </Link>
        </Button>

        <div>
          <Button
            title={"Create Group"}
            customClass={"p-2 text-slate-300"}
            onClick={() => {
              setIsCreatingGroup((prev) => !prev);
              if (searchUser) setSearchUser(false);
            }}
          >
            <GrGroup size={25} />
          </Button>

          {isCreatingGroup && (
            <CreateGroup setIsCreatingGroup={setIsCreatingGroup} />
          )}
        </div>

        <Button customClass="p-2" onClick={handleLogout} title="Logout">
          <IoIosLogOut size={25} />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
