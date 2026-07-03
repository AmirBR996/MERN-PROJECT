import krishik_Product from "../models/product_model.js";

const isSeller = (user) => user?.role === "seller";

const isOwnedByCurrentSeller = (product, userId) => {
    return String(product?.seller_id) === String(userId);
};

export const getProductById = async (req, res) => {
    try {
        const product = await krishik_Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await krishik_Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        if (!isSeller(req.user)) {
            return res.status(403).json({ message: "Only sellers can access product management" });
        }

        const products = await krishik_Product.find({ seller_id: req.user.id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("Error fetching seller products:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await krishik_Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!isSeller(req.user) || !isOwnedByCurrentSeller(product, req.user.id)) {
            return res.status(403).json({ message: "You can only delete your own products" });
        }

        await krishik_Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await krishik_Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!isSeller(req.user) || !isOwnedByCurrentSeller(product, req.user.id)) {
            return res.status(403).json({ message: "You can only update your own products" });
        }

        const updatedProduct = await krishik_Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error" });
    }
};  
export const createProduct = async (req, res) => {
    try {
        if (!isSeller(req.user)) {
            return res.status(403).json({ message: "Only sellers can create products" });
        }

        const newProduct = new krishik_Product({
            ...req.body,
            seller_id: req.user.id,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error" });
    }
};
