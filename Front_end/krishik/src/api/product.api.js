import API from "./index.js";

export const getAllProducts = async () => {
    try {
        const response = await API.get("/products/products");
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getMyProducts = async () => {
    try {
        const response = await API.get("/products/mine");
        return response.data;
    } catch (error) {
        console.error("Error fetching seller products:", error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await API.get(`/products/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await API.delete(`/products/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await API.put(`/products/products/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await API.post("/products/products", productData);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};