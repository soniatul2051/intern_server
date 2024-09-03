import { Router } from "express";
import { getUserBasedOnDate, getUserDetails, registerUser,registerPartialInfo } from "../controller/userInfo.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()
router.route("/save-partial-data").post(registerPartialInfo)
router.route("/register").post(upload.array("files",3),registerUser)
router.route("/").get(getUserDetails)
router.route("/").get(getUserBasedOnDate)
export default router