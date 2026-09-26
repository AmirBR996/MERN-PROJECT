import API from "./index.js";

export const createOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await API.get("/orders/mine");
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await API.get(`/orders/${id}`);
  return response.data;
};

// Seller Dashboard APIs
export const getSellerStats = async () => {
  const response = await API.get("/orders/seller/stats");
  return response.data;
};

export const getSellerSalesAnalytics = async () => {
  const response = await API.get("/orders/seller/analytics");
  return response.data;
};

export const getSellerOrders = async () => {
  const response = await API.get("/orders/seller/orders");
  return response.data;
};
