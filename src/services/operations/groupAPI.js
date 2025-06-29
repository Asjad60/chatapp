import toast from "react-hot-toast";
import { groupEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

export const createGroup = async (formData) => {
  const toastId = toast.loading("Loading...");
  try {
    const res = await apiConnector(
      groupEndpoints.CREATE_GROUP_API,
      "POST",
      {},
      formData
    );

    if (!res.success) {
      throw new Error(res.message);
    }

    toast.success("Group created");
  } catch (error) {
    console.log("create group error: ", error);
  }
  toast.dismiss(toastId);
};

export const getMyGroups = async () => {
  let res = null;
  try {
    res = await apiConnector(groupEndpoints.GET_MY_GROUPS_API);

    if (!res.success) {
      throw new Error(res.message);
    }
  } catch (error) {
    console.log("get my group error: ", error);
  }

  return res;
};

export const fetchGroupDetails = async (groupId) => {
  let res = null;
  try {
    res = await apiConnector(`${groupEndpoints.GET_GROUP_DETAILS}/${groupId}`);

    if (!res.success) {
      throw new Error(res.message);
    }
  } catch (error) {
    console.log("get group details error: ", error);
  }

  return res;
};

export const fetchGroupMessages = async (groupId, page = 1, limit = 50) => {
  let res = null;
  try {
    res = await apiConnector(
      `${groupEndpoints.GET_GROUP_MESSAGES}/${groupId}?page=${page}&limit=${limit}`
    );

    if (!res.success) {
      throw new Error(res.message);
    }
  } catch (error) {
    console.log("get group messages error: ", error);
  }

  return res;
};

export const fetchGroupsExceptMy = async () => {
  let res = null;
  try {
    res = await apiConnector(groupEndpoints.GET_GROUPS_EXCEPT_MY_API);

    if (!res.success) {
      throw new Error(res.message);
    }
  } catch (error) {
    console.log("get groups to join error: ", error);
  }

  return res;
};

export const JoinToGroup = async (groupId) => {
  const toastId = toast.loading("Loading...");
  let res = null;
  try {
    res = await apiConnector(
      groupEndpoints.JOIN_GROUP_API,
      "POST",
      {
        "Content-Type": "application/json",
      },
      { groupId }
    );

    if (!res.success) {
      throw new Error(res.message);
    }

    toast.success(res.message);
  } catch (error) {
    console.log("Join to group error: ", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return res;
};
