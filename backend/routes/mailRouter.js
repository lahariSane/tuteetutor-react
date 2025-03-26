import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import axios from "axios";
import User from "../models/userModule.js";
import morgan from 'morgan';

const mailRouter = express.Router();
mailRouter.use(morgan('combined')); // router level middleware

// Utility Functions
const generateJwtToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transporter.sendMail({ from: process.env.EMAIL, to, subject, text });
};

// Middleware
const validateRequest = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    next();
  };
};


// Routes
mailRouter.post("/auth/google-login", async (req, res) => {
  try {
    const { access_token } = req.body;
    const { data } = await axios.get( 
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { email, name, picture } = data;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name, role: "student", profileImage: picture });
      await user.save();
    }

    const token = generateJwtToken({
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });

    res.status(200).json({
      message: user ? "Login successful" : "Signup successful",
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

mailRouter.post("/auth/github-login", async (req, res) => {
  try {
    const { code } = req.body;
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    const accessToken = tokenResponse.data.access_token;
    const { data } = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { name, avatar_url } = data;
    const email = data.email || data.login + "@github.com";

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,
        role: "student",
        profileImage: avatar_url,
      });
      await user.save();
    }

    const token = generateJwtToken({
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });

    res.status(200).json({
      message: user ? "Login successful" : "Signup successful",
      token,
    });
  } catch (error) {
    console.error("Github login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

mailRouter.post(
  "/forgot-password",
  validateRequest(["email"]),
  async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      const token = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const resetLink = `http://localhost:3000/reset-password/${token}`;
      await sendEmail(
        email,
        "Password Reset Request",
        `Reset your password: ${resetLink}`
      );

      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

mailRouter.post(
  "/reset-password/:token",
  validateRequest(["password"]),
  async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user)
        return res.status(400).json({ error: "Invalid or expired token" });

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

mailRouter.post("/send-otp", validateRequest(["email"]), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      await User.findOneAndUpdate(
        { email },
        { otp, otpExpires },
        { new: true, upsert: true }
      );

      await sendEmail(
        email,
        "Your OTP Code",
        `Your OTP is ${otp}. It expires in 10 minutes.`
      );
      res.status(200).json({ message: "OTP sent successfully" });
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

mailRouter.post("/verify-otp", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.name = name;
    user.password = await bcrypt.hash(password, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateJwtToken({
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

mailRouter.post(
  "/login",
  validateRequest(["email", "password"]),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Invalid email" });
      }

      if (!user.password) {
        return res.status(400).json({ error: "Invalid password" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      const token = generateJwtToken({
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email, 
        profileImage: user.profileImage,
      });
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default mailRouter;
