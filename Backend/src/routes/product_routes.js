import express from "express";
import { authenticate } from "../middlewares/auth_middleware.js";
import { getAllProducts, getProductById, getMyProducts, deleteProduct, updateProduct, createProduct } from "../controller/product_controller.js";
const router = express.Router();
router.get("/mine", authenticate, getMyProducts);
router.post("/products", authenticate, createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.delete("/products/:id", authenticate, deleteProduct);
router.put("/products/:id", authenticate, updateProduct);

export default router;