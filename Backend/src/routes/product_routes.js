import express from "express";
import { authenticate } from "../controller/middlewares/auth_middleware.js";
import { getAllProducts, getProductById, getMyProducts, deleteProduct, updateProduct, createProduct } from "../controller/product_controller.js";
import upload from "../middlewares/upload_middleware.js";
const router = express.Router();
router.get("/mine", authenticate, getMyProducts);
router.post("/", authenticate, upload.single('image'), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", authenticate, deleteProduct);
router.put("/:id", authenticate, upload.single('image'), updateProduct);

export default router;