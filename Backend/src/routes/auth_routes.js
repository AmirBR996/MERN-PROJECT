import express from "express";
import { login, sendOtp, verifyOtp, getProfile, register } from "../controller/auth_controller.js";
import { authenticate } from "../controller/middlewares/auth_middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);

export default router;