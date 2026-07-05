import { hashPassword, comparePassword } from "../utils/bcrypt.utils.js";
import krishik_User from "../models/user_models.js";
import OtpVerification from "../models/otp_verification_model.js";
import { generateToken } from "../utils/jwt.utils.js";
import { sendOtpEmail } from "../services/email.service.js";

const OTP_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_SENDS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 5;

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const normalizeUserType = (user_type) => {
  const type = (user_type || "buyer").toLowerCase();
  return type === "seller" ? "seller" : "buyer";
};

const formatUserResponse = (user) => ({
  id: user._id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  location: user.location,
  user_type: user.user_type,
});

export const sendOtp = async (req, res) => {
  try {
    const { first_name, last_name, email, password, location, user_type } = req.body;

    if (!first_name || !last_name || !email || !password || !location || !user_type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await krishik_User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const existingOtp = await OtpVerification.findOne({ email: normalizedEmail });
    const now = Date.now();

    if (existingOtp?.lastSentAt && now - existingOtp.lastSentAt.getTime() < RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil(
        (RESEND_COOLDOWN_MS - (now - existingOtp.lastSentAt.getTime())) / 1000
      );
      return res.status(429).json({
        message: `Please wait ${waitSec} seconds before requesting a new code`,
        retryAfter: waitSec,
      });
    }

    if (existingOtp?.sendCount >= MAX_SENDS_PER_HOUR) {
      const hourAgo = new Date(now - 60 * 60 * 1000);
      if (existingOtp.updatedAt > hourAgo) {
        return res.status(429).json({
          message: "Too many OTP requests. Please try again in an hour.",
        });
      }
    }

    const sendCount =
      existingOtp && existingOtp.updatedAt > new Date(now - 60 * 60 * 1000)
        ? existingOtp.sendCount + 1
        : 1;

    const otp = generateOtp();
    const otpHash = await hashPassword(otp);
    const hashedPassword = await hashPassword(password);
    const expiresAt = new Date(now + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpVerification.findOneAndUpdate(
      { email: normalizedEmail },
      {
        otpHash,
        registrationData: {
          first_name,
          last_name,
          location,
          user_type: normalizeUserType(user_type),
          password: hashedPassword,
        },
        attempts: 0,
        sendCount,
        lastSentAt: new Date(now),
        expiresAt,
      },
      { upsert: true, new: true }
    );

    const emailResult = await sendOtpEmail(normalizedEmail, otp);

    const response = {
      message: emailResult.dev
        ? "Verification code generated (development mode — see code below)"
        : "Verification code sent to your email",
      email: normalizedEmail,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    };

    if (emailResult.dev) {
      response.devOtp = otp;
      response.devNotice =
        "SMTP is not configured. Use the code below or check the backend terminal. Add SMTP settings to Backend/.env for real emails.";
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("sendOtp error:", error);
    res.status(500).json({ message: error.message || "Failed to send verification code" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = await OtpVerification.findOne({ email: normalizedEmail });

    if (!record) {
      return res.status(400).json({ message: "No verification code found. Please register again." });
    }

    if (record.expiresAt < new Date()) {
      await OtpVerification.deleteOne({ email: normalizedEmail });
      return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
    }

    if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
      await OtpVerification.deleteOne({ email: normalizedEmail });
      return res.status(400).json({
        message: "Too many incorrect attempts. Please request a new verification code.",
      });
    }

    const isValid = await comparePassword(String(otp), record.otpHash);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      const remaining = MAX_VERIFY_ATTEMPTS - record.attempts;
      return res.status(400).json({
        message:
          remaining > 0
            ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
            : "Incorrect code. Please request a new verification code.",
      });
    }

    const existingUser = await krishik_User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await OtpVerification.deleteOne({ email: normalizedEmail });
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const user = await krishik_User.create({
      ...record.registrationData,
      email: normalizedEmail,
    });

    await OtpVerification.deleteOne({ email: normalizedEmail });

    const access_token = generateToken({
      id: user._id,
      email: user.email,
      user_type: user.user_type,
    });

    res.status(201).json({
      message: "Account created successfully",
      access_token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ message: error.message || "Verification failed" });
  }
};

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
      user: formatUserResponse(user),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong"
    });
  }
};
