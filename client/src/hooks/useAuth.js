import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: true, // Change this to false to simulate logout
  user: {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/300", // Fake profile picture
  },

  login: (userData) => set({ isLoggedIn: true, user: userData }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));

export default useAuthStore;
