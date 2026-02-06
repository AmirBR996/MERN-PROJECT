import { hashPassword } from "../utils/bcrypt.utils.js";
import krishik_User from "../models/user_models.js";
import { comparePassword } from "../utils/bcrypt.utils.js";
import { generateToken } from "../utils/jwt.utils.js";
export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, location, user_type } = req.body;

    if (!first_name || !last_name || !email || !password || !location) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await krishik_User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email"
      });
    }

    const hashedPassword = await hashPassword(password);

    await krishik_User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      location,
      user_type
    });

    res.status(201).json({
      message: "Account created successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Something went wrong"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await krishik_User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatched = await comparePassword(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const access_token = generateToken({
      id: user._id,
      email: user.email,
      user_type: user.user_type
    });

    res.status(200).json({
      message: "Logged in successfully",
      access_token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        location: user.location,
        user_type: user.user_type
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong"
    });
  }
};
