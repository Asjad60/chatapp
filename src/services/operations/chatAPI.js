import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { chatEndpoints } from "../apis";

export const getAllChats = async (receiverId, page = 1, limit = 10) => {
  let result = null;
  try {
    result = await apiConnector(
      chatEndpoints.GET_ALL_CHATS_API,
      "POST",
      {
        "Content-Type": "application/json",
      },
      { receiverId, page, limit }
    );

    // console.log("getAllChats => ", result);
    if (!result.success) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.log("getAllChats API ERROR ===> ", error);
    // toast.error(error.message);
  }
  return result;
};

export const sendAttachments = async (formData, setAlbum, setPreviewImg) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    result = await apiConnector(
      chatEndpoints.SEND_ATTACHMENTS,
      "POST",
      {},
      formData
    );

    // console.log("sendAttachments Data => ", result);
    if (!result.success) {
      throw new Error(result.message);
    }

    if (typeof setAlbum === "function") setAlbum([]);
    if (typeof setPreviewImg === "function") setPreviewImg([]);
    const albumInput = document.getElementById("album");
    if (albumInput) albumInput.value = "";
  } catch (error) {
    console.log("sendAttachments API ERROR ===> ", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
