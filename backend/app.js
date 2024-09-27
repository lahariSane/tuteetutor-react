import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from "./routes/user.js";
// import adminRouter from "./routes/admin.js";
import announcementsRouter from "./routes/announcementsRouter.js";
import holidaysRouter from "./routes/holidayRouter.js";
import timetableRouer from './routes/timetableRouter.js';
import DATABASE from './models/db.js';
import mailRouter from "./routes/mailRouter.js";
import courseRouter from "./routes/courseRouter.js";
import userCourseRouter from "./routes/userCourseRoute.js";
import leaveRequestRoutes from './routes/LeaveRequestRoutes.js';
import todosRouter from "./routes/todosRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
const db = new DATABASE();

app.use(cors());
app.use(express.json());

app.use('/', userRouter);
// app.use('/', adminRouter);
app.use('/', announcementsRouter);
app.use('/', timetableRouer);
app.use('/', holidaysRouter);
app.use('/', courseRouter);
app.use('/', userCourseRouter);
app.use('/api', mailRouter);
app.use("/api", todosRouter); // Add the todos routes
app.use('/leaveRequest', leaveRequestRoutes);

db.connect();


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
