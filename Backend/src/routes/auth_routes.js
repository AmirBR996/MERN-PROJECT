import express from "express";
import { register, login, sendOtp, verifyOtp } from "../controller/auth_controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

export default router;