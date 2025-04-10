import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  analyzeText,
  getMoodHistory,
  getMoodSummary,
  getMoodTrends,
  getTotalJournals,
  getUserWeeklyStability,
} from "../controllers/sentiments.controller.js";

const router = express.Router();

router.post("/analyze", verifyJWT, analyzeText);

// Trends and History
router.get("/trends", verifyJWT, getMoodTrends); // ?range=week|month|year
router.get("/history", verifyJWT, getMoodHistory); // ?range=week|month|year

// Summary + Total
router.get("/summary", verifyJWT, getMoodSummary);
router.get("/total", verifyJWT, getTotalJournals);

// Stability
router.get("/weekly-stability", verifyJWT, getUserWeeklyStability);

export default router;
