import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "../constants/events.js";
import { Message } from "../models/Mesaage.js";
import { uploadFileToCloud } from "../utils/uploadImgToCloud.js";
import { User } from "../models/User.js";
import Group from "../models/Group.js";

export const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId, page: _page, limit: _limit } = req.body;

    const limit = Number(_limit) || 10;
    const page = Number(_page) || 1;
    const skip = (page - 1) * limit;

    const findReceiver = await User.findById(receiverId);
    if (!findReceiver) {
      return res.status(400).json({
        success: false,
        message: "Invalid User",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).skip(skip).limit(limit).sort({ createdAt: -1 }).lean();

    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    });

    const hasNextPage = totalMessages > (page * limit);

    return res.status(200).json({
      success: true,
      message: "Messages Fetched",
      messages: messages.reverse(),
      pagination: {
        totalMessages,
        limit,
        page,
        hasNextPage,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user chats",
      error: error.message,
    });
  }
};

export const sendAttachments = async (req, res) => {
  try {
    const userSocketIDs = req.app.get("userSocketIDs");
    const io = req.app.get("io");

    const userId = req.user.id;
    const { receiverId, groupId } = req.body;
    const files = req.files;
    // console.log("files => ", files);
    if (!files) {
      return res.status(400).json({
        success: false,
        message: "files required",
      });
    }

    if (files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximun 5 Image Allowed",
      });
    }

    let attachments;
    try {
      attachments = await Promise.all(
        files.map((file) => {
          return uploadFileToCloud(file.path, process.env.CLOUD_FOLDER_NAME);
        })
      );
    } catch (err) {
      console.log("Attachments Uploading Error ", err);
      return res.status(403).json({
        success: false,
        message: "Attachments Uploading Error",
      });
    }

    // Safe mapping with filters to prevent TypeErrors
    const cloudURLnPublicId = (attachments || [])
      .filter((file) => file && file.secure_url)
      .map((file) => {
        return { url: file.secure_url, public_id: file.public_id };
      });

    const messageData = {
      content: "",
      sender: userId,
      attachments: cloudURLnPublicId,
      isDelivered: true,
    };

    if (receiverId) {
      messageData.receiver = receiverId;
    }

    if (groupId) {
      messageData.group = groupId;
    }

    if (receiverId && userSocketIDs && io) {
      const senderSocketId = typeof userSocketIDs.get === "function" ? userSocketIDs.get(userId.toString()) : null;
      const receiverSocketId = typeof userSocketIDs.get === "function" ? userSocketIDs.get(receiverId.toString()) : null;

      if (senderSocketId) {
        io.to(senderSocketId).emit(NEW_MESSAGE, messageData);
      }
      // Only emit to receiver if receiverSocketId is online and exists in map
      if (receiverSocketId && typeof userSocketIDs.has === "function" && userSocketIDs.has(receiverId.toString())) {
        io.to(receiverSocketId).emit(NEW_MESSAGE, messageData);
        io.to(receiverSocketId).emit(NEW_MESSAGE_ALERT, {
          sender: userId,
        });
      }
    }

    const message = await Message.create(messageData);

    if (groupId) {
      const realTimeMessage = await Message.findById(message._id).populate(
        "sender",
        "username image"
      );
      io.to(groupId).emit(NEW_MESSAGE, realTimeMessage);
      await Group.findByIdAndUpdate(
        groupId,
        {
          $push: { messages: message._id },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Attachments Sent & Uploaded",
      data: message,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Sending Attachments",
      error: error.message,
    });
  }
};
