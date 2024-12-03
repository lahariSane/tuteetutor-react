import express from "express";
import NotificationsController from "../controllers/notificationsController";
const router = express.Router();

router.get("/notifications", NotificationsController.getNotifications);

export default router;