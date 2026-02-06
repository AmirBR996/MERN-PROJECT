import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Location is required"]
    },
    user_type: {
      type: String,
      enum: ["seller", "buyer"],
      default: "Buyer"
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"]
    }
  },
  { timestamps: true }
);

const krishik_User = mongoose.model("User", userSchema);
export default krishik_User;
