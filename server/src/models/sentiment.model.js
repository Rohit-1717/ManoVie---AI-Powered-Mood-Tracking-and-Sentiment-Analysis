import mongoose from "mongoose";

const userSentimentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String, // e.g., "positive", "negative", "neutral"
      required: true,
    },
    sentimentScore: {
      type: Number, // e.g., 0.5, -0.7, 0.1
      required: true,
    },
    toxicity: {
      type: String, // e.g., "low", "medium", "high"
      required: true,
    },
    toxicityScore: {
      type: Number, // e.g., 0.2, 0.6
      required: true,
    },
    categoryScores: {
      type: Map, // Stores different toxicity attributes (e.g., TOXICITY, INSULT, THREAT)
      of: Number,
      default: {},
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const UserSentiment = mongoose.model(
  "UserSentiment",
  userSentimentSchema
);
