import API from "./index.js";

export const getAllVegetables = async ({ search = "", page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  const response = await API.get(`/vegetables?${params.toString()}`);
  return response.data;
};

export const getTodayVegetables = async () => {
  const response = await API.get("/vegetables/today");
  return response.data;
};

export const getVegetableHistory = async (name, { limit = 30 } = {}) => {
  const params = new URLSearchParams();
  if (limit) params.set("limit", limit);
  const response = await API.get(`/vegetables/${encodeURIComponent(name)}/history?${params.toString()}`);
  return response.data;
};

export const syncVegetables = async () => {
  const response = await API.post("/vegetables/sync");
  return response.data;
};
