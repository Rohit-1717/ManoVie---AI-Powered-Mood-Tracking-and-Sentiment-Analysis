import LoginLog from "../models/LoginLog.model.js";
import geoip from "geoip-lite";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ✅ Function to Log User Login
export const logUserLogin = asyncHandler(async (userId, req) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  // Get location from IP
  const geo = geoip.lookup(ip);
  const location = geo ? `${geo.city}, ${geo.country}` : "Unknown";

  // Get today's date (start of the day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let logEntry = await LoginLog.findOne({ userId, timestamp: { $gte: today } });

  if (logEntry) {
    // ✅ If user already logged in today, increase count
    logEntry.loginCount += 1;
    await logEntry.save();
  } else {
    // ✅ If first login today, create a new log entry
    logEntry = await LoginLog.create({
      userId,
      ipAddress: ip,
      userAgent,
      location,
    });
  }

  return logEntry;
});

// ✅ Controller to Fetch Login Logs
export const getUserLoginLogs = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const logs = await LoginLog.find({ userId }).sort({ timestamp: -1 });

  if (!logs.length) {
    throw new ApiError(404, "No login logs found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, logs, "Login logs retrieved"));
});
