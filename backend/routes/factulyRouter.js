import express from "express";
import { getFaculty, getAnnouncementsFaculty, deleteFaculty, addFaculty, getHodCourse } from "../controllers/facultyControllers.js";
import validateUser from "../middlewares/validateUser.js";

const router = express.Router();

router.get("/get-faculty", validateUser(), getFaculty);
router.get("/announcements/faculty", validateUser(), getAnnouncementsFaculty);
router.delete("/faculty/:facultyId/course/:courseId", validateUser(["hod"]), deleteFaculty);
router.post("/faculty", validateUser(["hod"]), addFaculty);
router.get("/hod-course", validateUser(["hod"]), getHodCourse);

export default router;
