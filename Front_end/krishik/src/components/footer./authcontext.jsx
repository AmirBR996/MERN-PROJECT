import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // LOGIN
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", token);
    setUser(userData);
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
      const token = localStorage.getItem("access_token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id;
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(
        `http://localhost:8080/users/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // 🔥 Update local storage + state
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      return data;
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  // DELETE USER
  const deleteUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id;
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(
        `http://localhost:8080/users/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

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
