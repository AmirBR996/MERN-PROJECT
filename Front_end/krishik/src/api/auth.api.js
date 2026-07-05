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

export const sendOtp = async (data) => {
  const { c_password, ...payload } = data;
  const response = await api.post("/auth/send-otp", payload);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
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
