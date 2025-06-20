import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import {
  FRIEND_REQUEST,
  MESSAGE_SEEN,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  READ_NOTIFICATION,
} from "./constants/events.js";
import userRoutes from "./routes/UserRoute.js";
import chatRoutes from "./routes/ChatRoute.js";
import groupRoutes from "./routes/GroupRoute.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import { socketAuthenticator } from "./middleware/auth.js";
import { errorMiddleware } from "./middleware/error.js";
import { Message } from "./models/Mesaage.js";
import { socketFriendRequestHandler } from "./controller/User.js";
import { Notification } from "./models/Notification.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.set("io", io);

connectDB();
cloudinaryConnect();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
const userSocketIDs = new Map();
const onlineUsers = new Set();

app.set("userSocketIDs", userSocketIDs);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/group", groupRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Chat App</h1>");
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);
    socketAuthenticator(null, socket, next);
  });
});

io.on("connection", (socket) => {
  const userId = socket.user.id;
  console.log("User Connected socketid => ", socket.id);

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
    socketFriendRequestHandler(requestedUser, notificationId, request, userId);
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

  socket.on("disconnect", () => {
    console.log("User Disconnected " + socket.user.email, socket.id);
    userSocketIDs.delete(userId.toString());
    onlineUsers.delete(userId.toString());
    io.emit("user_status", Array.from(onlineUsers));
  });
});

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});

export { userSocketIDs, onlineUsers, io };
export default server;
