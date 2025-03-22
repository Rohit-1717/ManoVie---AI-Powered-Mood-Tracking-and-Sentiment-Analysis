import analyzeSentiment from "../utils/sentimentAnalysis.js";
import analyzeToxicity from "../utils/toxicityAnalysis.js";
import { UserSentiment } from "../models/sentiment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import mongoose from "mongoose";

// ✅ 1. Analyze Text and Store Sentiment & Toxicity Data
export const analyzeText = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const userId = req.user._id;

  if (!text) {
    throw new ApiError(400, "Text is required");
  }

  // Run sentiment and toxicity analysis in parallel
  const [sentimentResult, toxicityResult] = await Promise.all([
    analyzeSentiment(text),
    analyzeToxicity(text),
  ]);

  // Categorizing toxicity score
  const toxicityValue =
    toxicityResult.attributeScores?.TOXICITY?.summaryScore?.value || 0;
  let toxicityCategory = "low";
  if (toxicityValue > 0.6) toxicityCategory = "high";
  else if (toxicityValue > 0.3) toxicityCategory = "medium";

  // Save the analysis in the database
  const newAnalysis = new UserSentiment({
    userId,
    text,
    sentiment: sentimentResult.sentiment,
    sentimentScore: sentimentResult.score,
    toxicity: toxicityCategory,
    toxicityScore: toxicityValue,
    categoryScores: {
      TOXICITY:
        toxicityResult.attributeScores?.TOXICITY?.summaryScore?.value || 0,
      SEVERE_TOXICITY:
        toxicityResult.attributeScores?.SEVERE_TOXICITY?.summaryScore?.value ||
        0,
      INSULT: toxicityResult.attributeScores?.INSULT?.summaryScore?.value || 0,
      THREAT: toxicityResult.attributeScores?.THREAT?.summaryScore?.value || 0,
      PROFANITY:
        toxicityResult.attributeScores?.PROFANITY?.summaryScore?.value || 0,
    },
  });

  await newAnalysis.save();

  // Response data
  const responseData = {
    userId: userId,
    sentiment: sentimentResult,
    toxicity: {
      attributeScores: toxicityResult.attributeScores,
      languages: toxicityResult.languages || ["en"],
      detectedLanguages: toxicityResult.detectedLanguages || ["en"],
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Analysis successful"));
});

// ✅ 2. Get User's Sentiment History (for visualization)
export const getUserSentiments = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const sentiments = await UserSentiment.find({ userId }).sort({
    analyzedAt: -1,
  });

  if (!sentiments.length) {
    throw new ApiError(404, "No sentiment data found for this user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sentiments,
        "User sentiment history retrieved successfully"
      )
    );
});

// ✅ 3. Get Sentiment & Toxicity Trends (Weekly, Monthly, Yearly)
export const getSentimentTrends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { period } = req.query; // "week", "month", "year"

  let timeUnit;
  if (period === "week") timeUnit = { $week: "$analyzedAt" };
  else if (period === "month") timeUnit = { $month: "$analyzedAt" };
  else if (period === "year") timeUnit = { $year: "$analyzedAt" };
  else
    throw new ApiError(400, "Invalid period. Use 'week', 'month', or 'year'");

  const trendData = await UserSentiment.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: timeUnit,
        avgSentimentScore: { $avg: "$sentimentScore" },
        avgToxicityScore: { $avg: "$toxicityScore" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  if (!trendData.length) {
    throw new ApiError(404, "No sentiment trends found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userId,
        trendData,
        `Sentiment trends retrieved for ${period}`
      )
    );
});

// export const getSentimentTrends = asyncHandler(async (req, res) => {
//   const userId = req.user._id; // User ID from auth middleware
//   const { period } = req.query; // "week", "month", "year"

//   // ✅ Validate period
//   if (!["week", "month", "year"].includes(period)) {
//     throw new ApiError(400, "Invalid period. Use 'week', 'month', or 'year'");
//   }

//   console.log("🔍 User ID:", userId);

//   // ✅ Aggregation Query with Date Grouping Fix
//   const trendData = await UserSentiment.aggregate([
//     { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Ensure ObjectId format
//     {
//       $group: {
//         _id: {
//           $dateToString: {
//             format: period === "week" ? "%Y-%U" : period === "month" ? "%Y-%m" : "%Y",
//             date: "$analyzedAt",
//           },
//         },
//         avgSentimentScore: { $avg: "$sentimentScore" },
//         avgToxicityScore: { $avg: "$toxicityScore" },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { _id: 1 } },
//   ]);

//   // console.log("🔍 Aggregation Result:", trendData);

//   if (!trendData.length) {
//     throw new ApiError(404, "No sentiment trends found");
//   }

//   return res.status(200).json(new ApiResponse(200, trendData, `Sentiment trends retrieved for ${period}`));
// });
