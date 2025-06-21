import { getContextData } from "../context/AuthProvider";
import { getSocket } from "../context/SocketProvider";
import Button from "../components/Button";

const Notification = () => {
  const { notifications } = getContextData();
  const socket = getSocket();

  const handleReadNotification = (notificationId) => {
    const findNotification = notifications.find(
      (item) => item._id === notificationId
    );
    if (findNotification.read) return;
    console.log("hello");
    socket.emit("read_notification", { notificationId });
  };

  // console.log("notifications => ", notifications);

  return (
    <div className="text-slate-100">
      {notifications?.length > 0 ? (
        <div className="p-6 w-full flex flex-col gap-1 divide-y divide-gray-400/35">
          {notifications?.map((notif) => (
            <div
              key={notif._id}
              className={`flex gap-2 cursor-pointer ${
                !notif.read && "bg-black/20"
              } p-2 rounded-md`}
              onClick={() => handleReadNotification(notif._id)}
            >
              <picture>
                <img
                  src={notif?.senderMessage?.imgURI}
                  alt={"senderImg"}
                  className="w-[60px] h-[60px] object-cover rounded-full"
                  loading="lazy"
                />
              </picture>
              <div>
                <div>
                  <p className="capitalize font-semibold">
                    {notif?.senderMessage?.title?.split(" ")[0]}
                  </p>
                  <p className="text-sm">
                    {notif?.senderMessage?.title
                      .split(" ")
                      .slice(1, notif?.senderMessage?.title?.length)
                      .join(" ")}
                  </p>
                </div>
                {notif?.status === "PENDING" && (
                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        socket.emit("friend_request", {
                          requestedUser: notif?.senderId,
                          notificationId: notif?._id,
                          request: true,
                        });
                      }}
                      text={"Accept"}
                      customClass={"text-green-500 px-2 py-1"}
                    />
                    <Button
                      onClick={() => {
                        socket.emit("friend_request", {
                          requestedUser: notif?.senderId,
                          notificationId: notif?._id,
                          request: false,
                        });
                      }}
                      text={"Reject"}
                      customClass={"text-red-500 px-2 py-1"}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No Notifications </div>
      )}
    </div>
  );
};

export default Notification;
