import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import { io, userSocketIDs } from "../index.js";
import { NOTIFICATION, REFETCH_FRINEDS } from "../constants/events.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(
      "-password"
    );

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

const getMyFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friends = await User.find({ friends: userId }).select("-password");

    if (!friends.length) {
      return res.status(200).json({
        success: true,
        message: "You Don't Have Any Friends",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Friends Found",
      friends,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Friends",
      error: error.message,
    });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId: receiver } = req.body;
    // console.log("requestId => ", requestId);
    if (!receiver) {
      return res.status(403).json({
        success: false,
        message: "Request ID Required",
      });
    }

    const user = await User.findById(userId).select("-password");

    const isAlreadySent = await Notification.findOne({
      senderId: userId,
      userId: receiver,
    });
    if (isAlreadySent?.status === "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent",
      });
    }

    let imgURI = user.image.url;
    if (!imgURI) {
      return res.status(400).json({
        success: false,
        message: "User image URL is missing",
      });
    }

    const notification = await Notification.create({
      userId: receiver,
      senderId: userId,
      senderMessage: {
        imgURI: imgURI,
        title: `${user.username} sent you a friend request`,
      },
    });

    const socketId = userSocketIDs.get(receiver);
    if (socketId) {
      io.to(socketId).emit(NOTIFICATION, notification);
    }

    return res.status(200).json({
      success: true,
      message: "Request Sent",
      notification,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Sending Friend Request",
      error: error.message,
    });
  }
};

const socketFriendRequestHandler = async (
  requestedUser,
  notificationId,
  request,
  userId
) => {
  try {
    const senderUser = await User.findById(userId).select("-password");
    if (!senderUser) {
      return io.to(userSocketIDs.get(requestedUser)).emit(NOTIFICATION, {
        request: "error",
        message: "Sender user not found",
      });
    }
    if (request) {
      const notificationForRealtime = {
        senderId: userId,
        userId: requestedUser,
        senderMessage: {
          imgURI: senderUser.image.url,
          title: `${senderUser.username} accepted your friend request`,
        },
        status: "ACCEPTED",
      };

      io.to(userSocketIDs.get(requestedUser)).emit(
        NOTIFICATION,
        notificationForRealtime
      );

      await Promise.all([
        Notification.create(notificationForRealtime),
        User.findByIdAndUpdate(
          senderUser._id,
          { $push: { friends: requestedUser } },
          { new: true }
        ),
        User.findByIdAndUpdate(
          requestedUser,
          { $push: { friends: senderUser._id } },
          { new: true }
        ),
        Notification.findByIdAndDelete(notificationId),
      ]);

      io.to(userSocketIDs.get(requestedUser)).emit(REFETCH_FRINEDS);
      io.to(userSocketIDs.get(userId)).emit(REFETCH_FRINEDS);
    } else {
      const notification = await Notification.create({
        senderId: userId,
        userId: requestedUser,
        senderMessage: {
          imgURI: senderUser.image.url,
          title: `${senderUser.username} rejected your friend request`,
        },
        status: "REJECTED",
      });
      io.to(userSocketIDs.get(requestedUser)).emit(NOTIFICATION, notification);
      await Notification.findByIdAndDelete(notificationId);
    }

    const notifications = await Notification.find({ userId });
    io.to(userSocketIDs.get(userId)).emit(NOTIFICATION, notifications);
  } catch (error) {
    console.error("Error handling friend request event:", error);
    io.to(userSocketIDs.get(requestedUser)).emit(NOTIFICATION, {
      request: "error",
      message: "An error occurred processing the friend request",
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // userId is receiver
    const notifications = await Notification.find({ userId });
    if (!notifications.length) {
      return res.status(200).json({
        success: true,
        message: "No Any Notification",
        notifications,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Notification found",
      notifications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Getting Notifications users",
      error: error.message,
    });
  }
};

export {
  getAllUsers,
  getMyFriends,
  sendFriendRequest,
  getNotifications,
  socketFriendRequestHandler,
};
