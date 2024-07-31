import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { userEndpoints } from "../apis";
import { logoutUser } from "./authAPI";

export const getAllUsers = async () => {
  let result = null;
  try {
    result = await apiConnector(userEndpoints.GET_ALL_USERS);

    // console.log("getAllUsers => ", result);
    if (!result.success) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.log("getAllUser API ERROR ===> ", error);
    // toast.error(error.message);
  }
  return result;
};

export const getMyFriends = async (token, navigate, setToken) => {
  let result = null;
  try {
    result = await apiConnector(userEndpoints.GET_MY_FRIENDS);

    // console.log("getAllUsers => ", result);
    if (!result.success) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.log("getAllUser API ERROR ===> ", error);
    logoutUser(token, setToken, navigate);
    // toast.error(error.message);
  }
  return result;
};

export const getNotifications = async () => {
  let result = null;
  // const toastId = toast.loading("Loading...");
  try {
    result = await apiConnector(userEndpoints.GET_NOTIFICATIONS);

    // console.log("GET_NOTIFICATIONS Data => ", result);
    if (!result.success) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.log("sendAttachments API ERROR ===> ", error);
    // toast.error(error.message);
  }
  // toast.dismiss(toastId);
  return result;
};

export const sendFriendRequest = async (requestId) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    result = await apiConnector(
      userEndpoints.SEND_FRIEND_REQUEST,
      "POST",
      {
        "Content-Type": "application/json",
      },
      { requestId }
    );

    // console.log("GET_NOTIFICATIONS Data => ", result);ss
    if (!result.success) {
      throw new Error(result.message);
    }
    toast.success(result.message);
  } catch (error) {
    console.log("sendAttachments API ERROR ===> ", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
