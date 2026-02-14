import express from "express";
import { getAllUsers , getUserById , deleteUser ,updateUser } from "../controller/user_controller.js";
const router = express.Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

export default router;

