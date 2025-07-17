import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "first_name is required"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "last_name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: 5,
    },
    phone_number: {
      type: String,
      max: 15,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
