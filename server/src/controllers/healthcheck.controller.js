import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const healthCheck = asyncHandler(async (req, res, next) => {
  let dbStatus = "Disconnected ❌";

  // Check database connection
  if (mongoose.connection.readyState === 1) {
    dbStatus = "Connected ✅";
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: "OK",
        database: dbStatus,
      },
      "Server is healthy ✅"
    )
  );
});

export { healthCheck };
