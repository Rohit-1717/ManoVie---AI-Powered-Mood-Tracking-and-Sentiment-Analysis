import { create } from "zustand";

const useTimeframeStore = create((set) => ({
  timeframe: "day", // Default timeframe
  setTimeframe: (newTimeframe) => set({ timeframe: newTimeframe }),
}));

export default useTimeframeStore;
