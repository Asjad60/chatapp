import express from "express";
import { getAllChats, sendAttachments } from "../controller/Chat.js";
import { isAuthenticated } from "../middleware/auth.js";
import { upload } from "../config/multer-config.js";
const router = express.Router();

router.post("/getAllChats", isAuthenticated, getAllChats);
router.post(
  "/sendAttachments",
  upload.array("files", 5),
  isAuthenticated,
  sendAttachments
);

export default router;
