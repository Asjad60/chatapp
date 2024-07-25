import express from "express";
import { signupUser, loginUser, logoutUser } from "../controller/Auth.js";
import {
  getAllUsers,
  getMyFriends,
  getNotifications,
  sendFriendRequest,
} from "../controller/User.js";
import { upload } from "../config/multer-config.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

//userAuth
router.post("/register", upload.single("profile"), signupUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);

//users
router.get("/getAllUsers", isAuthenticated, getAllUsers);
router.get("/getMyFriends", isAuthenticated, getMyFriends);

// user notifications
router.get("/getNotifications", isAuthenticated, getNotifications);
router.post("/sendFriendRequest", isAuthenticated, sendFriendRequest);

export default router;
