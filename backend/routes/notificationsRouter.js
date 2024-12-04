import express from "express";
import userModule from "../models/userModule.js";
import validateUser from "../middlewares/validateUser.js";

const router = express.Router();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/notifications", validateUser(), async (req, res) => {
  await sleep(1000);
  const users = await userModule.findOne({ _id: req.user.id });
  return res.status(200).json(users);
});

router.put("/notifications/mark-all-read", validateUser(), async (req, res) => {
  try {
    const user = await userModule.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.notifications = user.notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
    await user.save();

    return res
      .status(200)
      .json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
});

router.get("/notifications/check-unread", validateUser(), async (req, res) => {
  try {
    const user = await userModule.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const unreadNotificationsExist = user.notifications.some(
      (notification) => !notification.isRead
    );

    return res.status(200).json({
      status: unreadNotificationsExist,
      message: unreadNotificationsExist
        ? "There are unread notifications."
        : "No unread notifications."
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
});


export default router;
