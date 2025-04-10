import mongoose from "mongoose";

const userSentimentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indexed for faster filtering
    },
    text: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String, // "positive", "negative", "neutral"
      enum: ["positive", "negative", "neutral"],
      required: true,
    },
    sentimentScore: {
      type: Number, // Range: -1 to 1
      required: true,
    },
    toxicity: {
      type: String, // "low", "medium", "high"
      enum: ["low", "medium", "high"],
      required: true,
    },
    toxicityScore: {
      type: Number, // Range: 0 to 1
      required: true,
    },
    categoryScores: {
      type: Map, // e.g., { TOXICITY: 0.2, INSULT: 0.1 }
      of: Number,
      default: {},
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ✅ Compound index for fast user-based and time-based queries
userSentimentSchema.index({ userId: 1, createdAt: -1 });

export const UserSentiment = mongoose.model(
  "UserSentiment",
  userSentimentSchema
);
