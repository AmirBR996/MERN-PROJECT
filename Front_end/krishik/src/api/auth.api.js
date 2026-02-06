import api from "./index";

export const login = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (err) {
    console.error("Login API error:", err);
    throw err; 
  }
};

export const register = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (err) {
    console.error("Register API error:", err);
    throw err; 
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (err) {
    console.error("Profile API error:", err);
    throw err; 
  }
};
