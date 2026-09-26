import { createContext, useState, useEffect } from "react";
import API from "../../api/index.js";
import { updateUser as userApiUpdate, deleteUser as userApiDelete } from "../../api/user.api.js";

export const AuthContext = createContext();

const normalizeUser = (userData) => {
  if (!userData) return null;
  return {
    ...userData,
    user_type: String(userData.user_type || "buyer").toLowerCase(),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(normalizeUser(JSON.parse(storedUser)));
  }, []);

  const login = (userData, token) => {
    const normalized = normalizeUser(userData);
    localStorage.setItem("user", JSON.stringify(normalized));
    localStorage.setItem("access_token", token);
    setUser(normalized);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // UPDATE USER
  const updateUser = async (updatedData) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id;
      if (!userId) throw new Error("User ID not found");

      const data = await userApiUpdate(userId, updatedData);

      // 🔥 Update local storage + state
      localStorage.setItem("user", JSON.stringify(normalizeUser(data)));
      setUser(normalizeUser(data));

      return data;
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  // DELETE USER
  const deleteUser = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id;
      if (!userId) throw new Error("User ID not found");

      await userApiDelete(userId);

      logout();
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, deleteUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
