import analyzeSentiment from "../utils/sentimentAnalysis.js";
import analyzeToxicity from "../utils/toxicityAnalysis.js";
import { UserSentiment } from "../models/sentiment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import moment from "moment";

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

// ✅ 2. Mood Trend Over Time
export const getMoodTrends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const range = req.query.range || "week";

  const now = new Date();
  let startDate;

  if (range === "month") {
    startDate = new Date(now.setMonth(now.getMonth() - 1));
  } else if (range === "year") {
    startDate = new Date(now.setFullYear(now.getFullYear() - 1));
  } else {
    startDate = new Date(now.setDate(now.getDate() - 7));
  }

  const trends = await UserSentiment.aggregate([
    { $match: { userId, analyzedAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: "$analyzedAt" },
          month: { $month: "$analyzedAt" },
          day: { $dayOfMonth: "$analyzedAt" },
        },
        avgSentiment: { $avg: "$sentimentScore" },
        avgToxicity: { $avg: "$toxicityScore" },
      },
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        avgSentiment: 1,
        avgToxicity: 1,
        _id: 0,
      },
    },
    { $sort: { date: 1 } },
  ]);

  res.status(200).json(new ApiResponse(200, trends, "Mood trends"));
});

// ✅ 3. Get Mood Summary
export const getMoodSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const results = await UserSentiment.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$sentiment",
        count: { $sum: 1 },
        avgSentiment: { $avg: "$sentimentScore" },
        avgToxicity: { $avg: "$toxicityScore" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  if (results.length === 0) {
    return res.status(200).json(new ApiResponse(200, null, "No data yet"));
  }

  const moodEmojiMap = {
    positive: "😊",
    neutral: "😐",
    negative: "😔",
  };

  const topMood = results[0];

  res.status(200).json(
    new ApiResponse(
      200,
      {
        mostFrequentMood: topMood._id,
        emoji: moodEmojiMap[topMood._id] || "🤖",
        avgSentiment: topMood.avgSentiment,
        avgToxicity: topMood.avgToxicity,
        counts: results.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
      "Mood summary"
    )
  );
});

// 4. Total Journals

export const getTotalJournals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const count = await UserSentiment.countDocuments({ userId });

  res
    .status(200)
    .json(
      new ApiResponse(200, { totalJournals: count }, "Total journal entries")
    );
});

// 5.Get Mood History Controller
export const getMoodHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { range = "week" } = req.query;

  let startDate = new Date();
  if (range === "month") {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (range === "year") {
    startDate.setFullYear(startDate.getFullYear() - 1);
  } else {
    startDate.setDate(startDate.getDate() - 7);
  }

  const entries = await UserSentiment.find({
    userId,
    analyzedAt: { $gte: startDate },
  }).sort({ analyzedAt: -1 });

  const history = entries.map((entry) => ({
    text: entry.text,
    sentiment: entry.sentiment,
    sentimentScore: entry.sentimentScore,
    toxicity: entry.toxicity,
    toxicityScore: entry.toxicityScore,
    analyzedAt: entry.analyzedAt,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, history, "Mood history retrieved successfully"));
});

export const getUserWeeklyStability = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all sentiments from the last 7 days
  const oneWeekAgo = moment().subtract(7, "days").toDate();

  const sentiments = await UserSentiment.find({
    userId,
    createdAt: { $gte: oneWeekAgo },
  });

  if (!sentiments || sentiments.length === 0) {
    return res.status(200).json({
      success: true,
      weeklyStability: "No Data",
    });
  }

  const scores = sentiments.map((entry) => entry.sentimentScore);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const diff = max - min;

  let weeklyStability = "Stable";

  if (diff > 0.4) weeklyStability = "Unstable";
  else if (diff > 0.2) weeklyStability = "Slightly Unstable";

  res.status(200).json({
    success: true,
    weeklyStability,
    scoreRange: {
      min: min.toFixed(3),
      max: max.toFixed(3),
      difference: diff.toFixed(3),
    },
    totalEntries: sentiments.length,
  });
});
