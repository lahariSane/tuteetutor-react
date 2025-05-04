import express from "express";
import { searchController } from "../controllers/searchController.js";
import validateUser from "../middlewares/validateUser.js";

const router = express.Router();

// Search routes with authentication
router.get(
  "/search/announcements",
  validateUser(),
  searchController.searchAnnouncements,
);
router.get("/search/todos", validateUser(), searchController.searchTodos);
router.get("/search/global", validateUser(), searchController.globalSearch);

export default router;
