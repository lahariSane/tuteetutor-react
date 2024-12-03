import express from "express";
import { getUsers } from "../controllers/addFacultyControllers.js";
import validateUser from '../middlewares/validateUser.js';

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "hi" });
});
router.get("/users", validateUser(["hod", "admin"]), getUsers);

export default router;
