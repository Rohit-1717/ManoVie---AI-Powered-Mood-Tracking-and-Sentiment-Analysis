import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useSentimentStore = create((set, get) => ({
  sentimentTrend: [],
  userSentiments: [],
  totalJournals: 0,
  averageMood: null,
  moodSummary: null,
  moodDistribution: [],
  weeklyStability: null,
  error: null,
  loading: false,
  loadingWeeklyStability: false,

  analyzeText: async (text) => {
    try {
      set({ loading: true });
      const res = await axios.post(
        `${import.meta.env.VITE_SENTIMENTS_URL}/analyze`,
        { text },
        { withCredentials: true }
      );
      set({ loading: false });
      return res.data?.data ?? null;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Analysis failed";
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  fetchSentimentTrend: async (range = "week") => {
    try {
      set({ loading: true });
      const res = await axios.get(
        `${import.meta.env.VITE_SENTIMENTS_URL}/trends?range=${range}`,
        { withCredentials: true }
      );

      const raw = res?.data?.data || [];
      const transformed = raw.map((item) => ({
        ...item,
        createdAt: item.date
          ? new Date(item.date).toISOString()
          : new Date().toISOString(),
        avgSentiment: item.avgSentiment ?? 0,
        avgToxicity: item.avgToxicity ?? 0,
        categoryScores: item.categoryScores || {},
      }));

      set({ sentimentTrend: transformed, loading: false });
      return transformed;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch trends";
      set({ error: message, loading: false });
      console.error("fetchSentimentTrend:", message);
      return [];
    }
  },

  fetchAverageMood: async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SENTIMENTS_URL}/summary`,
        {
          withCredentials: true,
        }
      );

      const data = res?.data?.data ?? null;

      if (!data) {
        set({ averageMood: null, moodSummary: null, moodDistribution: [] });
        return null;
      }

      const distribution =
        data.counts && typeof data.counts === "object"
          ? Object.entries(data.counts).map(([label, value]) => ({
              label,
              value,
            }))
          : [];

      set({
        averageMood: {
          label: data.mostFrequentMood ?? null,
          emoji: data.emoji ?? null,
          avgSentiment: data.avgSentiment ?? 0,
          avgToxicity: data.avgToxicity ?? 0,
          categoryScores: data.categoryScores || {},
        },
        moodSummary: data,
        moodDistribution: distribution,
      });

      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch summary";
      set({ error: message });
      console.error("fetchAverageMood:", message);
      return null;
    }
  },

  fetchTotalJournals: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(
        `${import.meta.env.VITE_SENTIMENTS_URL}/total`,
        {
          withCredentials: true,
        }
      );
      const val = res?.data?.data?.totalJournals ?? 0;
      set({ totalJournals: val, loading: false });
      return val;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch total journals";
      set({ error: message, loading: false });
      console.error("fetchTotalJournals:", message);
      return 0;
    }
  },

  fetchWeeklyStability: async () => {
    try {
      set({ loadingWeeklyStability: true });
      const res = await axios.get(
        `${import.meta.env.VITE_SENTIMENTS_URL}/weekly-stability`,
        {
          withCredentials: true,
        }
      );

      const data = res?.data?.data ?? null;

      if (!data || data.weeklyStability === "No Data") {
        set({ weeklyStability: null, loadingWeeklyStability: false });
        return null;
      }

      set({
        weeklyStability: {
          stability: data.weeklyStability,
          scoreRange: data.scoreRange || null,
          totalEntries: data.totalEntries ?? 0,
        },
        loadingWeeklyStability: false,
      });

      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch weekly stability";
      set({ error: message, loadingWeeklyStability: false });
      console.error("fetchWeeklyStability:", message);
      return null;
    }
  },

  fetchMoodHistory: async (range = "week") => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SENTIMENTS_URL}/history?range=${range}`,
        { withCredentials: true }
      );
      const data = res?.data?.data ?? [];
      set({ userSentiments: data });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch mood history";
      set({ error: message });
      console.error("fetchMoodHistory:", message);
      return [];
    }
  },

  clearError: () => set({ error: null }),
}));

export default useSentimentStore;
