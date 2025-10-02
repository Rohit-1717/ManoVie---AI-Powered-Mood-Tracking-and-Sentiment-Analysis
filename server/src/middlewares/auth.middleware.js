import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: "/",
};

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Try verifying access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) throw new ApiError(401, "User not found");
    req.user = user;
    return next();
  } catch (err) {
    // If access token expired, try refresh token
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedRefresh._id);
        if (!user || user.refreshToken !== refreshToken) throw new ApiError(401, "Invalid refresh token");

        // Generate new tokens
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        // Set new cookies
        res.cookie("accessToken", newAccessToken, cookieOptions);
        res.cookie("refreshToken", newRefreshToken, cookieOptions);

        req.user = user;
        return next();
      } catch (refreshErr) {
        return res.status(401).json({ message: "Refresh token expired" });
      }
    }

    return res.status(401).json({ message: "Invalid access token" });
  }
});
