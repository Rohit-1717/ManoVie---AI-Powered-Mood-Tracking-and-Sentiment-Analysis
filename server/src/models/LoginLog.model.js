import mongoose from "mongoose";

const loginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  location: { type: String, default: "Unknown" },
  loginCount: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("LoginLog", loginLogSchema);
