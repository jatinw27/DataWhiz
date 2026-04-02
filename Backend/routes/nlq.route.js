import express from "express";
import { handleNLQ } from "../nlq-engine/nlq.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/ask", protect, handleNLQ);



export default router;