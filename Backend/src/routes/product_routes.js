import express from "express";
import { getAllProducts , getProductById , deleteProduct ,updateProduct ,createProduct} from "../controller/product_controller.js";
const router = express.Router();
router.post("/products", createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);

export default router;