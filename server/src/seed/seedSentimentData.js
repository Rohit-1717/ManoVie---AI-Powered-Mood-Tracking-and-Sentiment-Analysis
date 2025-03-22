import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserSentiment } from "../models/sentiment.model.js";

dotenv.config();

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://rohitdeveloper0523:qBvhryAPX2Plndl3@cluster0.k4gh3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ MongoDB connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

await connectDB();

// ✅ Use the given user ID instead of generating a new one
const userId = new mongoose.Types.ObjectId("67dc9a47f3f87d6f4850ecd6");

// ✅ Generate past dates
const generatePastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// ✅ Insert sample data
const seedData = async () => {
  try {
    console.log("🛠 Clearing existing data for the user...");
    await UserSentiment.deleteMany({ userId }); // ✅ Clears only this user's data

    const sampleData = [];

    for (let i = 0; i < 30; i++) {
      sampleData.push({
        userId, // ✅ Ensure correct user ID is used
        text: `Sample sentiment ${i}`,
        sentiment: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)],
        sentimentScore: Math.random(),
        toxicity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        toxicityScore: Math.random(),
        analyzedAt: generatePastDate(i), // ✅ Spread data across 30 days
      });
    }

    console.log("🚀 Inserting sample data...");
    await UserSentiment.insertMany(sampleData);
    console.log("✅ Seed data inserted successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    mongoose.connection.close();
  }
};

await seedData();
