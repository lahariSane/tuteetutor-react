import mongoose from "mongoose";
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import mailRouter from "./routes/mailRouter.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 2004;

app.use(cors());
app.use(express.json());

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

app.use('/api', mailRouter)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})