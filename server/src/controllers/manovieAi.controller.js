// controllers/manovie.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fetch from "node-fetch";
import cookie from "cookie";

// --- Gemini Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Function Definitions ---
const getMoodHistoryFunction = {
  name: "get_mood_history",
  description:
    "Fetches the user's mood and sentiment history from their mental health journal.",
  parameters: {
    type: "object",
    properties: {
      range: {
        type: "string",
        description: "Time range: 'day', 'week', 'month', or 'year'",
        enum: ["day", "week", "month", "year"],
      },
    },
    required: ["range"],
  },
};

const searchMentalHealthResourcesFunction = {
  name: "search_mental_health_resources",
  description:
    "Searches for mental health resources, products, apps, or techniques.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string" },
      category: {
        type: "string",
        enum: [
          "apps",
          "products",
          "techniques",
          "therapy",
          "books",
          "research",
          "general",
        ],
      },
    },
    required: ["query"],
  },
};

// --- DB call for Mood History ---
const fetchMoodHistory = async (range, token) => {
  const res = await fetch(
    `http://localhost:5000/api/v1/users/sentiments/history?range=${range}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // pass the JWT
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      `Mood history fetch failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
};

// --- Local Search ---
const searchMentalHealthResources = async (query, category = "general") => {
  return {
    query,
    category,
    results: [
      {
        name: "Headspace",
        description: "Meditation and mindfulness app",
        rating: 4.8,
        link: "https://www.headspace.com",
      },
    ],
    timestamp: new Date().toISOString(),
  };
};

// --- System Instructions ---
const systemInstruction = `You are a compassionate and knowledgeable mental health companion AI named ManoVie. ...`;

// --- Controller: Chat with ManoVie ---
const manovieChat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // --- Get token from Authorization header OR cookies ---
  let userToken = req.headers.authorization?.split(" ")[1];
  if (!userToken && req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    userToken = cookies.accessToken;
  }

  if (!userToken) {
    return res.status(401).json({ message: "Token not found" });
  }

  // --- Start Gemini chat ---
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    tools: [
      {
        functionDeclarations: [
          getMoodHistoryFunction,
          searchMentalHealthResourcesFunction,
        ],
      },
    ],
    systemInstruction,
  });

  const chat = model.startChat();

  let result = await chat.sendMessage(message);
  let response = result.response;

  const functionCalls = response.functionCalls();
  const functionResponses = [];

  if (functionCalls?.length) {
    for (const fn of functionCalls) {
      if (fn.name === "get_mood_history") {
        const range = fn.args.range || "week";
        const moodData = await fetchMoodHistory(range, userToken);
        functionResponses.push({
          functionResponse: { name: "get_mood_history", response: moodData },
        });
      } else if (fn.name === "search_mental_health_resources") {
        const searchResults = await searchMentalHealthResources(
          fn.args.query,
          fn.args.category || "general"
        );
        functionResponses.push({
          functionResponse: {
            name: "search_mental_health_resources",
            response: searchResults,
          },
        });
      }
    }

    if (functionResponses.length > 0) {
      result = await chat.sendMessage(functionResponses);
      response = result.response;
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { reply: response.text() }, "ManoVie response"));
});

export { manovieChat };
