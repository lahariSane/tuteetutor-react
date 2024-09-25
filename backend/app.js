import cors from 'cors';
import nodemailer from 'nodemailer';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import announcementsRouter from "./routes/announcementsRouter.js";
import holidaysRouter from "./routes/holidayRouter.js";
import timetableRouer from './routes/timetableRouter.js';
import DATABASE from './models/db.js';
import mailRouter from "./routes/mailRouter.js";
import courseRouter from "./routes/courseRouter.js";
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const db = new DATABASE();
db.connect();

app.use(cors());
app.use(express.json());

app.use('/', userRouter);
app.use('/', adminRouter);
app.use('/', announcementsRouter);
app.use('/', timetableRouer);
app.use('/', holidaysRouter);
app.use('/', courseRouter);
app.use('/api', mailRouter);

db.connect();

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})