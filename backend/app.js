import cors from 'cors';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import DATABASE from './models/db.js';
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const db = new DATABASE();
db.connect();

app.use(cors());
app.use(express.json());
dotenv.config();

app.use('/', userRouter)
app.use('/', adminRouter) 

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})