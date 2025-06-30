import { Server } from "socket.io";
import {
  FRIEND_REQUEST,
  GROUP_MESSAGE,
  JOIN_ROOM,
  LEAVE_ROOM,
  MESSAGE_SEEN,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  READ_NOTIFICATION,
} from "../constants/events.js";
import { socketAuthenticator } from "../middleware/auth.js";
import cookieParser from "cookie-parser";
import { Message } from "../models/Mesaage.js";
import { socketFriendRequestHandler } from "../controller/User.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import Group from "../models/Group.js";
import ApiError from "../utils/ApiError.js";

export const initializeSocket = async (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });
  app.set("io", io);

  const userSocketIDs = new Map();
  const onlineUsers = new Set();

  app.set("userSocketIDs", userSocketIDs);

  io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
      if (err) return next(err);
      socketAuthenticator(null, socket, next);
    });
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log("User Connected socketid => ", socket.user.email, socket.id);

    userSocketIDs.set(userId.toString(), socket.id);
    onlineUsers.add(userId.toString());
    socket.on("user_status", () => {
      io.emit("user_status", Array.from(onlineUsers));
    });

    socket.on(NEW_MESSAGE, async ({ sender, receiver, content }) => {
      try {
        // console.log("data ==> ", sender, receiver, content);
        io.to(userSocketIDs.get(receiver)).emit(NEW_MESSAGE, {
          sender,
          receiver,
          content,
        });
        io.to(userSocketIDs.get(receiver)).emit(NEW_MESSAGE_ALERT, {
          sender,
        });
        const message = await Message({ sender, receiver, content });
        await message.save();
      } catch (error) {
        console.error("Error handling new message event:", error);
      }
    });

    socket.on(MESSAGE_SEEN, async ({ senderId, receiverId }) => {
      try {
        const result = await Message.updateMany(
          { sender: receiverId, receiver: senderId, seen: false },
          { $set: { seen: true } }
        );
        // console.log("Message seen => ", result);
      } catch (error) {
        console.log("MESSAGE_SEEN Error ", error.message);
      }
      io.to(userSocketIDs.get(receiverId)).emit(MESSAGE_SEEN, {
        senderId,
        receiverId,
        seen: true,
      });
    });

    socket.on(FRIEND_REQUEST, ({ requestedUser, notificationId, request }) => {
      // console.log("requestedUser, request => ", requestedUser, request);
      socketFriendRequestHandler(
        requestedUser,
        notificationId,
        request,
        userId,
        io,
        userSocketIDs
      );
    });

    socket.on(READ_NOTIFICATION, async ({ notificationId }) => {
      // console.log("notificationId => ", notificationId);
      const updatedNotification = await Notification.findByIdAndUpdate(
        notificationId,
        {
          read: true,
        },
        { new: true }
      );
      io.to(userSocketIDs.get(userId)).emit(READ_NOTIFICATION, {
        updatedNotification,
      });
    });

    socket.on(JOIN_ROOM, async ({ groupId }) => {
      socket.join(groupId);
    });

    socket.on(LEAVE_ROOM, async ({ groupId }) => {
      socket.leave(groupId);
    });

    socket.on(GROUP_MESSAGE, async (data) => {
      const { groupId, message } = data;
      console.log("GROUP_MESSAGE: ", groupId, message);

      try {
        const group = await Group.findById(groupId);

        if (!group) {
          throw new ApiError("gorup not found", 404);
        }

        const newMessage = await Message.create({
          sender: userId,
          group: groupId,
          content: message,
          isDelivered: true,
        });

        const populatedMessage = await Message.findById(
          newMessage._id
        ).populate("sender", "username image");

        if (group.members.some((member) => member.equals(userId))) {
          console.log("inside the if of group message");
          io.to(groupId).emit(NEW_MESSAGE, populatedMessage);

          group.messages.push(newMessage._id);

          await group.save();
        } else {
          throw new ApiError("Unauthorized: Not a group member", 403);
        }
      } catch (error) {
        console.log("Something went wrong at group message: ", error);
        socket.emit("ERROR", {
          message: error.message || "Something went wrong at group message",
          code: error.statusCode || 500,
        });
      }
    });

    socket.on("typing", (data) => {
      const { receiverId, groupId, isTyping } = data;
      const receiverSocketId = userSocketIDs.get(receiverId);
      if (data.hasOwnProperty("receiverId")) {
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("user-typing", {
            sender: userId,
            receiver: receiverId,
            isTyping,
          });
        }
      } else {
        socket.to(groupId).emit("user-typing", {
          username: socket.user.username,
          sender: userId,
          groupId,
          isTyping,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected " + socket.user.email, socket.id);
      userSocketIDs.delete(userId.toString());
      onlineUsers.delete(userId.toString());
      io.emit("user_status", Array.from(onlineUsers));
    });
  });
};
