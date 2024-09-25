import cors from 'cors';
import nodemailer from 'nodemailer';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import announcementsRouter from "./routes/announcementsRouter.js";
import timetableRouer from './routes/timetableRouter.js';
import DATABASE from './models/db.js';
import mailRouter from "./routes/mailRouter.js";
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const db = new DATABASE();
db.connect();

app.use(cors());
app.use(express.json());

app.use('/', userRouter)
app.use('/', adminRouter) 
app.use('/', announcementsRouter)
app.use('/', timetableRouer)
app.use('/api', mailRouter)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB via Mongoose");
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit();
    }
};
connectDB();

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})