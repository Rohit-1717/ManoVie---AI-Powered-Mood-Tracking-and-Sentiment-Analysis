import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useManoVieAiStore = create(
  persist(
    (set, get) => ({
      messages: [
        {
          from: "ai",
          text: "Hello! I'm your companion. How are you feeling today?",
        },
      ],
      loading: false,
      error: null,

      // Send user message and get AI response
      sendMessage: async (message) => {
        if (!message.trim()) return;

        // Add user message
        set((state) => ({
          messages: [...state.messages, { from: "user", text: message }],
        }));

        set({ loading: true, error: null });

        try {
          // Call ManoVie AI API
          const res = await axios.post(
            `http://localhost:5000/api/v1/ai/chat`,
            { message },
            { withCredentials: true }
          );

          const aiReply =
            res.data?.data?.reply || "Sorry, I didn't understand.";

          // Add AI reply
          set((state) => ({
            messages: [...state.messages, { from: "ai", text: aiReply }],
            loading: false,
          }));
        } catch (err) {
          console.error(
            "Manovie API error:",
            err.response?.data || err.message
          );
          set((state) => ({
            messages: [
              ...state.messages,
              { from: "ai", text: "Error fetching response." },
            ],
            loading: false,
            error: err.response?.data?.message || err.message,
          }));
        }
      },

      clearChat: () => set({ messages: [] }),
    }),
    {
      name: "manovie-ai-storage",
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);

export default useManoVieAiStore;
