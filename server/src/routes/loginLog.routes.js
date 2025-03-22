import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserLoginLogs } from "../controllers/userLog.controller.js";

const router = express.Router();

// ✅ Route to get login logs
router.get("/logs", verifyJWT, getUserLoginLogs);

export default router;
