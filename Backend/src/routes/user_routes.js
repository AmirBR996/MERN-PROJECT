import express from "express";
import { getAllUsers , getUserById , deleteUser ,updateUser } from "../controller/user_controller.js";
import { authenticate } from "../controller/middlewares/auth_middleware.js";
const router = express.Router();

router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, getUserById);
router.delete("/:id", authenticate, deleteUser);
router.put("/:id", authenticate, updateUser);

export default router;

