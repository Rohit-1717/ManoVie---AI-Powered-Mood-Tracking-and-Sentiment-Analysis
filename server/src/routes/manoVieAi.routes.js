import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { manovieChat } from "../controllers/manovieAi.controller.js";
const router = express.Router();

router.post("/chat", verifyJWT, manovieChat);

export default router;
