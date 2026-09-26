import express from "express";
import { authenticate } from "../controller/middlewares/auth_middleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerStats,
  getSellerSalesAnalytics,
  getSellerOrders
} from "../controller/order_controller.js";

const router = express.Router();

// Buyer Routes
router.post("/", authenticate, createOrder);
router.get("/mine", authenticate, getMyOrders);
router.get("/:id", authenticate, getOrderById);

// Seller Routes
router.get("/seller/stats", authenticate, getSellerStats);
router.get("/seller/analytics", authenticate, getSellerSalesAnalytics);
router.get("/seller/orders", authenticate, getSellerOrders);

export default router;
