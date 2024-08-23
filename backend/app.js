import mongoose from "mongoose";
import cors from 'cors';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from "./routes/user.js";

const app = express();
const server = http.createServer(app);
const PORT = 2004;

app.use(cors());
app.use(express.json());
dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE);
        console.log("Connected to MongoDB via Mongoose");
    }
    catch(err){
        console.err('Failed to connect to MongoDB', err);
        process.exit();
    }
};
connectDB();

app.use('/', userRouter)

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})