import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userAgentMiddleware } from "./middlewares/userAgent.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(userAgentMiddleware); // Apply user agent middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import logInLog from "./routes/loginLog.routes.js";
import sentimentRoutes from "./routes/sentiment.routes.js";

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/loginLog", logInLog);
app.use("/api/v1/users/sentiments", sentimentRoutes);

export { app };
