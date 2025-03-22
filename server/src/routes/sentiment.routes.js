import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { analyzeText, getSentimentTrends, getUserSentiments } from "../controllers/sentiments.controller.js";

const router = express.Router();

router.post("/analyze", verifyJWT, analyzeText);
router.get("/get-user-sentiment", verifyJWT, getUserSentiments);
router.get("/get-user-sentiment-trend", verifyJWT, getSentimentTrends);

export default router;
