import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      authChecked: false,

      registerUser: async (formData) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_USER_BASE_URL}/register`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true,
            }
          );
          const { user, accessToken } = response.data.data;
          set({
            user,
            token: accessToken,
            loading: false,
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error) {
          set({
            loading: false,
            error:
              error.response?.data?.message || error.message || "Something went wrong",
          });
          return {
            success: false,
            message:
              error.response?.data?.message || error.message || "Something went wrong",
          };
        }
      },

      loginUser: async ({ username, password }) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_USER_BASE_URL}/login`,
            { username, password },
            { withCredentials: true }
          );
          const { user, accessToken } = response.data.data;
          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true };
        } catch (err) {
          set({
            loading: false,
            isAuthenticated: false,
            error: err.response?.data?.message || err.message || "Login failed",
          });
          return {
            success: false,
            message: err.response?.data?.message || err.message || "Login failed",
          };
        }
      },

      updateAvatar: async (avatarFile) => {
        try {
          const formData = new FormData();
          formData.append("avatar", avatarFile);
          const response = await axios.patch(
            "http://localhost:5000/api/v1/users/avatar",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true,
            }
          );
          const updatedUser = response.data.data;
          set((state) => ({
            user: { ...state.user, avatar: updatedUser.avatar },
          }));
          return { success: true };
        } catch (error) {
          return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to update avatar",
          };
        }
      },

      updateProfile: async (updatedFields) => {
        try {
          const res = await axios.patch(
            "http://localhost:5000/api/v1/users/update-account",
            updatedFields,
            { withCredentials: true }
          );
          const updatedUser = res.data?.data;
          if (updatedUser) {
            set({ user: updatedUser });
          }
          return {
            success: res.data.success,
            message: res.data.message,
            data: updatedUser,
          };
        } catch (error) {
          return {
            success: false,
            message: error.response?.data?.message || "Something went wrong",
          };
        }
      },

      changePassword: async ({ oldPassword, newPassword, confirmPassword }) => {
        try {
          await axios.patch(
            "http://localhost:5000/api/v1/users/change-password",
            { oldPassword, newPassword, confirmPassword },
            { withCredentials: true }
          );
          return { success: true };
        } catch (error) {
          return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to change password",
          };
        }
      },

      fetchUserFromToken: async () => {
        set({ loading: true });
        try {
          const res = await axios.get(`${import.meta.env.VITE_USER_BASE_URL}/me`, {
            withCredentials: true,
          });
          const user = res.data?.data;
          set({
            user,
            isAuthenticated: true,
            loading: false,
            authChecked: true,
          });
        } catch (err) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            authChecked: true,
          });
        }
      },

      logoutUser: async () => {
        try {
          await axios.post(`${import.meta.env.VITE_USER_BASE_URL}/logout`, {}, {
            withCredentials: true,
          });
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            authChecked: false,
          });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        authChecked: state.authChecked,
      }),
    }
  )
);

export default useAuthStore;
