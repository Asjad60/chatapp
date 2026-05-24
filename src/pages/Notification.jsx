import { getContextData } from "../context/AuthProvider";
import { getSocket } from "../context/SocketProvider";
import { Link } from "react-router-dom";
import { IoArrowBack, IoCheckmark, IoClose, IoNotifications } from "react-icons/io5";

const Notification = () => {
  const { notifications } = getContextData();
  const socket = getSocket();

  const handleReadNotification = (notificationId) => {
    const findNotification = notifications.find(
      (item) => item._id === notificationId
    );
    if (findNotification?.read) return;
    socket.emit("read_notification", { notificationId });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#f4f7fc] overflow-y-auto light-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#f4f7fc]/95 backdrop-blur-sm border-b border-slate-200/60 px-5 py-4 flex items-center gap-3">
        <Link
          to="/"
          className="p-2 rounded-xl bg-white border border-slate-200/60 text-slate-500 hover:text-[#0047e1] hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 chat-shadow-sm"
        >
          <IoArrowBack size={18} />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-sm font-extrabold text-slate-800">Notifications</h1>
          <span className="text-[10px] text-slate-400 font-semibold">
            {notifications?.length > 0
              ? `${notifications.filter((n) => !n.read).length} unread`
              : "All caught up"}
          </span>
        </div>
        {notifications?.filter((n) => !n.read).length > 0 && (
          <span className="ml-auto bg-[#0047e1] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col gap-2 max-w-2xl w-full mx-auto">
        {notifications?.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleReadNotification(notif._id)}
              className={`relative flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer group
                ${
                  !notif.read
                    ? "bg-white border-blue-100 chat-shadow-sm"
                    : "bg-[#f8f9fb] border-slate-200/60 hover:bg-white hover:border-slate-200"
                }`}
            >
              {/* Unread indicator dot */}
              {!notif.read && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-[#0047e1] rounded-full" />
              )}

              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={notif?.senderMessage?.imgURI}
                  alt="sender"
                  className="w-11 h-11 object-cover rounded-full border border-slate-100 shadow-sm"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-slate-800 capitalize leading-tight">
                  {notif?.senderMessage?.title?.split(" ")[0]}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {notif?.senderMessage?.title
                    ?.split(" ")
                    .slice(1)
                    .join(" ")}
                </p>

                {/* Accept / Reject buttons for pending friend requests */}
                {notif?.status === "PENDING" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        socket.emit("friend_request", {
                          requestedUser: notif?.senderId,
                          notificationId: notif?._id,
                          request: true,
                        });
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-green-50 text-green-600 border border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500 rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer"
                    >
                      <IoCheckmark size={13} />
                      Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        socket.emit("friend_request", {
                          requestedUser: notif?.senderId,
                          notificationId: notif?._id,
                          request: false,
                        });
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer"
                    >
                      <IoClose size={13} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center chat-shadow-sm">
              <IoNotifications size={28} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">No notifications yet</p>
              <p className="text-[11px] text-slate-400 mt-1">You're all caught up!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
