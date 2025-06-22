import Group from "../models/Group.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadFileToCloud } from "../utils/uploadImgToCloud.js";

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
