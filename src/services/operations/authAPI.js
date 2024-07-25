import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../apis.js";

export const signupUser = async (formData, navigate) => {
  const toastId = toast.loading("Loading...");
  try {
    const result = await apiConnector(
      authEndpoints.SIGNUP_API,
      "POST",
      {},
      formData
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    toast.success("User Created");
    navigate("/login");
  } catch (error) {
    console.log("signupUser API ERROR ===> ", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
};

export const loginUser = async (loginData, navigate, setToken, setUser) => {
  try {
    let result = await apiConnector(
      authEndpoints.LOGIN_API,
      "POST",
      { "Content-Type": "application/json" },
      loginData
    );
    // console.log("login result => ", result);

    if (!result.success) {
      throw new Error(result.message);
    }

    setToken(result.user.token);
    setUser(result.user);
    localStorage.setItem("token", JSON.stringify(result.user.token));
    localStorage.setItem("user", JSON.stringify(result.user));
    navigate("/");
  } catch (error) {
    console.log("loginUser API ERROR ===> ", error);
    toast.error(error.message);
  }
};

export const logoutUser = async (token, setToken, navigate) => {
  try {
    let result = await apiConnector(authEndpoints.LOGOUT_API, "POST", {
      "Content-Type": "application/json",
    });

    if (!result.success) {
      throw new Error(result.message);
    }

    if (result.success) {
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lastChatWith");
      navigate("/login");
      toast.success("Logged out");
    }
  } catch (error) {
    console.log("logoutUser API ERROR ===> ", error);
    toast.error(error.message);
  }
};
