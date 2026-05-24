import Group from "../models/Group.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadFileToCloud } from "../utils/uploadImgToCloud.js";
import { Message } from "../models/Mesaage.js";

export const createGroup = asyncHandler(async (req, res) => {
  const { groupName, membersId: memberIds } = req.body;
  const groupProfile = req?.file?.path;
  const userId = req.user.id;

  let membersId = JSON.parse(memberIds);

  if (!groupName || !membersId.length) {
    throw new ApiError("Group name and Members is required", 400);
  }

  let upload = null;
  if (groupProfile) {
    upload = await uploadFileToCloud(
      groupProfile,
      process.env.CLOUD_FOLDER_NAME
    );
  }

  await Group.create({
    groupName,
    admin: userId,
    members: [...membersId, userId],
    groupProfile: upload ? upload.secure_url : "",
  });

  return res.status(201).json({
    success: true,
    message: "Group Created",
  });
});

export const getAllMyGroups = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const groups = await Group.find({
    members: userId,
  }).populate("admin members", "username email");

  if (!groups.length) {
    throw new ApiError("Groups not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Groups Found",
    data: groups,
  });
});

export const addOrRemoveMember = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { membersIds = [], action } = req.body;
  const groupId = req.params.groupId;

  if (!membersIds.length || !action) {
    throw new ApiError("Members Ids and action is required", 400);
  }

  if (membersIds.length > 5 && action === "add") {
    throw new ApiError("You can add 5 Members at a time", 406);
  }

  const group = await Group.findOne({
    _id: groupId,
    admin: userId,
  });

  if (!group) {
    throw new ApiError("Groups not found", 404);
  }

  let updatedMembers;
  if (action === "add") {
    updatedMembers = await Group.findOneAndUpdate(
      {
        _id: groupId,
        admin: userId,
      },
      {
        $addToSet: { members: { $each: membersIds } },
      },
      { new: true }
    );
  } else if (action === "remove") {
    updatedMembers = await Group.findOneAndUpdate(
      {
        _id: groupId,
        admin: userId,
      },
      {
        $pull: { members: { $in: membersIds } },
      },
      { new: true }
    );
  } else {
    throw new ApiError("Invalid action. Use 'add' or 'remove'", 400);
  }

  return res.status(200).json({
    success: true,
    message: action === "add" ? "Members added" : "Members removed",
    data: updatedMembers.members,
  });
});

export const getGroupDetails = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    throw new ApiError("groupId is required", 400);
  }

  const group = await Group.findById(groupId).populate(
    "admin members",
    "username image"
  );

  if (!group) {
    throw new ApiError("invalid group or group is deleted", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Group details Found",
    data: group,
  });
});

export const getGroupMessages = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user.id;
  const skip = (page - 1) * limit;

  const groupMessages = await Message.find({ group: groupId })
    .sort({ createdAt: -1 })
    .populate("sender receiver", "username image")
    .skip(skip)
    .limit(limit);

  if (groupMessages.length === 0) {
    throw new ApiError("No messages found", 404);
  }

  const totalMessages = await Message.countDocuments({ group: groupId });
  const totalPages = Math.ceil(totalMessages / limit);

  res.status(200).json({
    success: true,
    messages: groupMessages.reverse(),
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalMessages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

export const getGroupsExceptMy = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const groups = await Group.find(
    { members: { $not: { $elemMatch: { $eq: userId } } } },
    { messages: false }
  );

  if (groups.length === 0) {
    throw new ApiError("Groups not found", 404);
  }

  return res.status(200).json({
    message: "Groups Found",
    success: true,
    data: groups,
  });
});

export const joinGroup = asyncHandler(async (req, res) => {
  const io = req.app.get("io");
  const userSocketIDs = req.app.get("userSocketIDs");
  const userId = req.user.id;
  const { groupId } = req.body;

  if (!groupId) {
    throw new ApiError("GroupID required", 400);
  }

  const group = await Group.findOne(
    {
      _id: groupId,
      members: { $not: { $elemMatch: { $eq: userId } } },
    },
    "_id groupName groupPorfile members"
  );

  if (!group) {
    throw new ApiError("Group not found or Already in group", 404);
  }

  group.members.push(userId);
  await group.save();

  io.to(userSocketIDs.get(userId)).emit("join_group", group);

  return res.status(200).json({
    success: true,
    message: "Group Joined",
  });
});
