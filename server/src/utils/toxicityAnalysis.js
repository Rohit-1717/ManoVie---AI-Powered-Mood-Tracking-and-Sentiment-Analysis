import axios from "axios";

const API_KEY = process.env.PERSPECTIVE_API;
const DISCOVERY_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;

async function analyzeToxicity(text) {
  try {
    const analyzeRequest = {
      comment: { text },
      languages: ["en"],
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        INSULT: {},
        THREAT: {},
        PROFANITY: {},
      },
    };

    // console.log(
    //   "🔍 Sending Request to Perspective API:",
    //   JSON.stringify(analyzeRequest, null, 2)
    // );

    const response = await axios.post(DISCOVERY_URL, analyzeRequest);

    // console.log(
    //   "✅ Perspective API Response:",
    //   JSON.stringify(response.data, null, 2)
    // );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Perspective API Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to analyze text with Perspective API");
  }
}

export default analyzeToxicity;

// Previous Tested Code and It's working:

// import { GoogleAuth } from "google-auth-library";
// import dotenv from "dotenv";
// import axios from "axios";

// dotenv.config(); // ✅ Load environment variables

// const API_KEY = process.env.PERSPECTIVE_API;
// const DISCOVERY_URL =
//   "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=" +
//   API_KEY;

// async function analyzeToxicity(text) {
//   try {
//     const analyzeRequest = {
//       comment: { text },
//       requestedAttributes: { TOXICITY: {} },
//     };

//     // ✅ Make a direct API request to Perspective API
//     const response = await axios.post(DISCOVERY_URL, analyzeRequest);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Perspective API Error:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to analyze text with Perspective API");
//   }
// }

// export default analyzeToxicity;
