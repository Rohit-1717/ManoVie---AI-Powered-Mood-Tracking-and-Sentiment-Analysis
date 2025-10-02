import analyzeSentiment from "../utils/sentimentAnalysis.js";
import analyzeToxicity from "../utils/toxicityAnalysis.js";
import { UserSentiment } from "../models/sentiment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import moment from "moment";

/**
 * 1️⃣ Analyze Text & Save
 */
export const analyzeText = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const userId = req.user._id;

  if (!text) throw new ApiError(400, "Text is required");

  const [sentimentResult, toxicityResult] = await Promise.all([
    analyzeSentiment(text),
    analyzeToxicity(text),
  ]);

  const toxicityValue =
    toxicityResult.attributeScores?.TOXICITY?.summaryScore?.value || 0;
  let toxicityCategory = "low";
  if (toxicityValue > 0.6) toxicityCategory = "high";
  else if (toxicityValue > 0.3) toxicityCategory = "medium";

  const newAnalysis = new UserSentiment({
    userId,
    text,
    sentiment: sentimentResult.sentiment,
    sentimentScore: sentimentResult.score,
    toxicity: toxicityCategory,
    toxicityScore: toxicityValue,
    categoryScores: {
      TOXICITY: toxicityResult.attributeScores?.TOXICITY?.summaryScore?.value || 0,
      SEVERE_TOXICITY: toxicityResult.attributeScores?.SEVERE_TOXICITY?.summaryScore?.value || 0,
      INSULT: toxicityResult.attributeScores?.INSULT?.summaryScore?.value || 0,
      THREAT: toxicityResult.attributeScores?.THREAT?.summaryScore?.value || 0,
      PROFANITY: toxicityResult.attributeScores?.PROFANITY?.summaryScore?.value || 0,
    },
  });

  await newAnalysis.save();

  res.status(200).json({
    statusCode: 200,
    success: true,
    data: {
      userId,
      sentiment: sentimentResult,
      toxicity: {
        attributeScores: toxicityResult.attributeScores,
        languages: toxicityResult.languages || ["en"],
        detectedLanguages: toxicityResult.detectedLanguages || ["en"],
      },
    },
    message: "Analysis successful",
  });
});

/**
 * 2️⃣ Mood Trends
 */
export const getMoodTrends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const range = req.query.range || "week";

  const now = new Date();
  let startDate;
  if (range === "month") startDate = new Date(now.setMonth(now.getMonth() - 1));
  else if (range === "year") startDate = new Date(now.setFullYear(now.getFullYear() - 1));
  else startDate = new Date(now.setDate(now.getDate() - 7));

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
        avgTOXICITY: { $avg: "$categoryScores.TOXICITY" },
        avgSEVERE_TOXICITY: { $avg: "$categoryScores.SEVERE_TOXICITY" },
        avgINSULT: { $avg: "$categoryScores.INSULT" },
        avgTHREAT: { $avg: "$categoryScores.THREAT" },
        avgPROFANITY: { $avg: "$categoryScores.PROFANITY" },
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
        avgTOXICITY: 1,
        avgSEVERE_TOXICITY: 1,
        avgINSULT: 1,
        avgTHREAT: 1,
        avgPROFANITY: 1,
        _id: 0,
      },
    },
    { $sort: { date: 1 } },
  ]);

  res.status(200).json({
    statusCode: 200,
    success: true,
    data: trends || [],
    message: "Mood trends",
  });
});

/**
 * 3️⃣ Mood Summary
 */
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
        avgTOXICITY: { $avg: "$categoryScores.TOXICITY" },
        avgSEVERE_TOXICITY: { $avg: "$categoryScores.SEVERE_TOXICITY" },
        avgINSULT: { $avg: "$categoryScores.INSULT" },
        avgTHREAT: { $avg: "$categoryScores.THREAT" },
        avgPROFANITY: { $avg: "$categoryScores.PROFANITY" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  if (!results || results.length === 0)
    return res.status(200).json({ statusCode: 200, success: true, data: null, message: "No data yet" });

  const moodEmojiMap = { positive: "😊", neutral: "😐", negative: "😔" };
  const topMood = results[0];

  res.status(200).json({
    statusCode: 200,
    success: true,
    data: {
      mostFrequentMood: topMood._id,
      emoji: moodEmojiMap[topMood._id] || "🤖",
      avgSentiment: topMood.avgSentiment,
      avgToxicity: topMood.avgToxicity,
      counts: results.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      categoryScores: {
        TOXICITY: topMood.avgTOXICITY,
        SEVERE_TOXICITY: topMood.avgSEVERE_TOXICITY,
        INSULT: topMood.avgINSULT,
        THREAT: topMood.avgTHREAT,
        PROFANITY: topMood.avgPROFANITY,
      },
    },
    message: "Mood summary",
  });
});

/**
 * 4️⃣ Total Journals
 */
export const getTotalJournals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const count = await UserSentiment.countDocuments({ userId });

  res.status(200).json({
    statusCode: 200,
    success: true,
    data: { totalJournals: count },
    message: "Total journal entries",
  });
});

/**
 * 5️⃣ Mood History
 */
export const getMoodHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { range = "week" } = req.query;

  let startDate = new Date();
  if (range === "month") startDate.setMonth(startDate.getMonth() - 1);
  else if (range === "year") startDate.setFullYear(startDate.getFullYear() - 1);
  else startDate.setDate(startDate.getDate() - 7);

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
    categoryScores: entry.categoryScores,
    analyzedAt: entry.analyzedAt,
  }));

  res.status(200).json({
    statusCode: 200,
    success: true,
    data: history || [],
    message: "Mood history retrieved successfully",
  });
});

/**
 * 6️⃣ Weekly Stability
 */
export const getUserWeeklyStability = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const oneWeekAgo = moment().subtract(7, "days").toDate();

  const sentiments = await UserSentiment.find({ userId, createdAt: { $gte: oneWeekAgo } });

  if (!sentiments || sentiments.length === 0) {
    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: { weeklyStability: "No Data" },
      message: "No sentiment entries in the last week",
    });
  }

  const scores = sentiments.map((e) => e.sentimentScore);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const diff = max - min;

  let weeklyStability = "Stable";
  if (diff > 0.4) weeklyStability = "Unstable";
  else if (diff > 0.2) weeklyStability = "Slightly Unstable";

  res.status(200).json({
    statusCode: 200,
    success: true,
    data: {
      weeklyStability,
      scoreRange: { min, max, difference: diff },
      totalEntries: sentiments.length,
    },
    message: "Weekly stability calculated",
  });
});
