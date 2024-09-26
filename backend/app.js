import cors from "cors";
import nodemailer from "nodemailer";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import announcementsRouter from "./routes/announcementsRouter.js";
import timetableRouter from "./routes/timetableRouter.js";
import mailRouter from "./routes/mailRouter.js";
import todosRouter from "./routes/todosRoutes.js"; // Import the todos router

import DATABASE from "./models/db.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect to the database
const db = new DATABASE();
db.connect();

app.use(cors());
app.use(express.json());

// Use routes
app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", announcementsRouter);
app.use("/", timetableRouter);
app.use("/api", mailRouter);
app.use("/api", todosRouter); // Add the todos routes

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
