import express from "express";
import Collections from "../controllers/get-collections.js";

const router = express.Router();
const collections  = new Collections();

router.get('/collections', collections.getCollections);

export default router;