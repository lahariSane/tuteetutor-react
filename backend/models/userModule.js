import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, required: true, default: "student" },
  notifications: { type: Array, default: [] },
  profileImage: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  otp: String,
  otpExpires: Date,
  bio:{type:String},
});

export default mongoose.model("user", userSchema);
