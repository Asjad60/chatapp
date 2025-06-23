import express from "express";
import { upload } from "../config/multer-config.js";
import { isAuthenticated } from "../middleware/auth.js";
import {
  addOrRemoveMember,
  createGroup,
  getAllMyGroups,
  getGroupDetails,
} from "../controller/Group.js";
const router = express.Router();

router.post(
  "/createGroup",
  upload.single("groupProfile"),
  isAuthenticated,
  createGroup
);
router.post("/addOrRemoveMembers/:groupId", isAuthenticated, addOrRemoveMember);
router.get("/getAllGroups", isAuthenticated, getAllMyGroups);
router.get("/getGroupDetails/:groupId", isAuthenticated, getGroupDetails);

export default router;
