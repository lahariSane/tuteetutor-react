import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import announcementsRouter from "./routes/announcementsRouter.js";
import holidaysRouter from "./routes/holidayRouter.js";
import timetableRouter from "./routes/timetableRouter.js";
import DATABASE from "./models/db.js";
import mailRouter from "./routes/mailRouter.js";
import courseRouter from "./routes/courseRouter.js";
import userCourseRouter from "./routes/userCourseRoute.js";
import leaveRequestRoutes from "./routes/LeaveRequestRoutes.js";
import todosRouter from "./routes/todosRoutes.js";
import userinfoRouter from './routes/userRouter.js';
import facultyRouter from "./routes/facultyRouter.js";
import contactRoutes from "./routes/contactRoutes.js";
import notificationRouter from "./routes/notificationsRouter.js";
import breakRouter from "./routes/breaksRouter.js";
import changeRouter from "./routes/changesRouter.js";
import morgan from 'morgan';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
const db = new DATABASE();
 
// application level middleware
app.use(cors());
app.use(express.json()); // inbuilt middleware
app.use(morgan('dev')); // third party middleware
app.use(express.urlencoded({ extended: true }));

app.use('/', userRouter);
app.use('/', adminRouter);
app.use('/', announcementsRouter);
app.use('/', timetableRouter);
app.use('/', holidaysRouter);
app.use('/', courseRouter);
app.use('/', userCourseRouter);
app.use('/', facultyRouter);
app.use('/', notificationRouter);
app.use('/api', mailRouter);
app.use("/api", todosRouter); 
app.use('/api', courseRouter);
app.use('/api',userinfoRouter)
app.use('/leaveRequest', leaveRequestRoutes);
app.use('/break', breakRouter);
app.use('/changes', changeRouter);
app.use("/api/contact", contactRoutes);
db.connect();

// error handling middleware
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
 