import express from "express";
import Collections from "../controllers/get-collections.js";

const router = express.Router();
const collections  = new Collections();

router.get('/collections', collections.getCollections);
router.get('/collections/:name', collections.getCollectionByName);
router.patch('/collections/leaverequests/:id', collections.updateLeaveRequestStatus);
router.get('/faculty', collections.getFaculty);
router.delete('/faculty/:id', collections.deleteFaculty);
router.delete('/hod/:id', collections.deleteHod);

export default router;