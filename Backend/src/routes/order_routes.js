import express from "express";
import { authenticate } from "../middlewares/auth_middleware.js";
import { createOrder, getMyOrders, getOrderById } from "../controller/order_controller.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/mine", authenticate, getMyOrders);
router.get("/:id", authenticate, getOrderById);

export default router;
