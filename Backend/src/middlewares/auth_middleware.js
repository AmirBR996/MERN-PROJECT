import { verifyToken } from "../utils/jwt.utils.js";
import User from "../models/user.model.js"; // make sure this path is correct

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized. No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.user_type
    };

    next();

  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};
