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
