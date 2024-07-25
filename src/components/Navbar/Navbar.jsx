import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getContextData } from "../../context/AuthProvider";
import { logoutUser } from "../../services/operations/authAPI";
import { IoNotifications } from "react-icons/io5";
import Button from "../Button";
import { getSocket } from "../../context/SocketProvider";
import { IoIosLogOut, IoIosSearch } from "react-icons/io";
import SearchUsers from "./SearchUsers";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState(false);
  const [users, setUsers] = useState([]);
  const { token, setToken, user, notifications } = getContextData();
  const socket = getSocket();

  const handleLogout = async () => {
    await logoutUser(token, setToken, navigate);
    socket.disconnect();
  };

  return (
    <nav className="rounded-t-lg max-w-[900px] w-full flex justify-between items-start dark:shadow-dark-mode shadow-light-mode dark:bg-dark-gradient bg-light-gradient p-2">
      <h1 className="text-3xl font-extrabold">Chit Chat</h1>

      <div className="relative flex gap-3 items-center">
        <div className="">
          <Button
            onClick={() => setSearchUser(true)}
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
            {notifications.filter((item) => !item.read).length > 0 && (
              <span className="absolute -bottom-2 -right-1 text-[.6rem] py-0.5 px-1.5 rounded-full bg-red-500">
                {notifications.filter((item) => !item.read).length}
              </span>
            )}
          </Link>
        </Button>
        <Button customClass="p-2" onClick={handleLogout} title="Logout">
          <IoIosLogOut size={25} />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
