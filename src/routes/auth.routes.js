import { Router } from "express"
import {  getCurrentUser, loginUser, registerUser } from "../controller/auth.controller.js"
import verifyUserToken from "../middleware/auth.js"
const router = Router()
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/").get(verifyUserToken,getCurrentUser)
export default router