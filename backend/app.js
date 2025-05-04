import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import announcementsRouter from "./routes/announcementsRouter.js";
import holidaysRouter from "./routes/holidayRouter.js";
import timetableRouter from "./routes/timetableRouter.js";
import mailRouter from "./routes/mailRouter.js";
import courseRouter from "./routes/courseRouter.js";
import userCourseRouter from "./routes/userCourseRoute.js";
import leaveRequestRoutes from "./routes/LeaveRequestRoutes.js";
import todosRouter from "./routes/todosRoutes.js";
import userinfoRouter from "./routes/userRouter.js";
import facultyRouter from "./routes/facultyRouter.js";
import contactRoutes from "./routes/contactRoutes.js";
import notificationRouter from "./routes/notificationsRouter.js";
import breakRouter from "./routes/breaksRouter.js";
import changeRouter from "./routes/changesRouter.js";
import morgan from "morgan";
import swaggerDocs from "./swaggerConfig.js";
import searchRoutes from "./routes/searchRoutes.js";
import initializationService from "./services/initializationService.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

swaggerDocs(app);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", announcementsRouter);
app.use("/", timetableRouter);
app.use("/", holidaysRouter);
app.use("/", courseRouter);
app.use("/", userCourseRouter);
app.use("/", facultyRouter);
app.use("/", notificationRouter);
app.use("/api", mailRouter);
app.use("/api", todosRouter);
app.use("/api", courseRouter);
app.use("/api", userinfoRouter);
app.use("/leaveRequest", leaveRequestRoutes);
app.use("/break", breakRouter);
app.use("/changes", changeRouter);
app.use("/api/contact", contactRoutes);
app.use("/api", searchRoutes);

// Error handlers
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
