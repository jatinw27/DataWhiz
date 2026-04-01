import express from "express";
import { handleNLQ } from "../nlq-engine/nlq.controller.js";

const router = express.Router();
router.post("/ask", handleNLQ);

export default router;