import express from "express";
import { getFaculty, deleteFaculty, addFaculty, getHodCourse } from "../controllers/facultyControllers.js";
import validateUser from "../middlewares/validateUser.js";

const router = express.Router();

router.get("/faculty", validateUser(), getFaculty);
router.delete("/faculty/:facultyId/course/:courseId", validateUser(["hod"]), deleteFaculty);
router.post("/faculty", validateUser(["hod"]), addFaculty);
router.get("/hod-course", validateUser(["hod"]), getHodCourse);

export default router;
