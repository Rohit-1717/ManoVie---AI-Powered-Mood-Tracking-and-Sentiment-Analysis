// src/store/useSentimentStore.js
import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./useAuthStore";

export const useSentimentStore = create((set, get) => ({
  sentimentTrend: [],
  userSentiments: [],
  totalJournals: 0,
  averageMood: null,
  moodSummary: null,
  weeklyStability: null,
  error: null,
  loading: false,
  loadingWeeklyStability: false,

  // 1. Analyze text and store result
  analyzeText: async (text) => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "User not authenticated" });

    try {
      set({ loading: true });
      const res = await axios.post(
        "http://localhost:5000/api/v1/users/sentiments/analyze",
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ loading: false });
      return res.data.data; // returns { sentiment, toxicity }
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // 2. Mood trend (Line Chart etc.)
  fetchSentimentTrend: async (range = "week") => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "User not authenticated" });

    try {
      set({ loading: true });
      const res = await axios.get(
        `http://localhost:5000/api/v1/users/sentiments/trends?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ sentimentTrend: res.data.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // 3. Mood summary
  fetchAverageMood: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "User not authenticated" });

    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/users/sentiments/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({
        averageMood: {
          label: res.data.data.mostFrequentMood,
          emoji: res.data.data.emoji,
          avgSentiment: res.data.data.avgSentiment,
          avgToxicity: res.data.data.avgToxicity,
        },
        moodSummary: res.data.data,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    }
  },

  // 4. Total journals
  fetchTotalJournals: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "User not authenticated" });

    try {
      set({ loading: true });
      const res = await axios.get(
        "http://localhost:5000/api/v1/users/sentiments/total",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ totalJournals: res.data.data.totalJournals, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // 5. Mood history (recent entries)
  fetchUserSentiments: async (range = "week") => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "User not authenticated" });

    try {
      set({ loading: true });
      const res = await axios.get(
        `http://localhost:5000/api/v1/users/sentiments/history?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ userSentiments: res.data.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // 6. Weekly stability
  fetchWeeklyStability: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "User not authenticated" });

    try {
      set({ loadingWeeklyStability: true });
      const res = await axios.get(
        "http://localhost:5000/api/v1/users/sentiments/weekly-stability",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({
        weeklyStability: {
          stability: res.data.weeklyStability,
          scoreRange: res.data.scoreRange,
          totalEntries: res.data.totalEntries,
        },
        loadingWeeklyStability: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loadingWeeklyStability: false,
      });
    }
  },

  // Utility method to clear errors
  clearError: () => set({ error: null }),
}));
