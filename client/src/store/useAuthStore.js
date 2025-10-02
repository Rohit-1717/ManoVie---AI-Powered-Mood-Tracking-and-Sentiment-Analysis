import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      isAuthenticated: false,
      authChecked: false,

      loginUser: async ({ username, password }) => {
        set({ loading: true });
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_USER_BASE_URL}/login`,
            { username, password },
            { withCredentials: true }
          );

          set({
            user: res.data.data.user,
            isAuthenticated: true,
            authChecked: true,
            loading: false,
          });

          return { success: true };
        } catch (err) {
          set({ loading: false, isAuthenticated: false });
          return {
            success: false,
            message: err.response?.data?.message || err.message,
          };
        }
      },

      fetchUserFromToken: async () => {
        set({ loading: true });
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_USER_BASE_URL}/me`,
            {
              withCredentials: true,
            }
          );
          set({
            user: res.data.data,
            isAuthenticated: true,
            authChecked: true,
            loading: false,
          });
        } catch (err) {
          set({
            user: null,
            isAuthenticated: false,
            authChecked: true,
            loading: false,
          });
        }
      },

      logoutUser: async () => {
        set({
          user: null,
          isAuthenticated: false,
          authChecked: true, // mark auth as checked
          loading: false, // stop spinner
        });

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_USER_BASE_URL}/logout`,
            {},
            { withCredentials: true }
          );
          console.log(res.data.message || "Logged out successfully");
        } catch (err) {
          console.error("Logout failed:", err);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        authChecked: state.authChecked,
      }),
    }
  )
);

export default useAuthStore;
