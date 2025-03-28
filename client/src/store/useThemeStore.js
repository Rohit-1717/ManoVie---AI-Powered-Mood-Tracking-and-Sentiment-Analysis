import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "wireframe",
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "wireframe" ? "black" : "wireframe";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    });
  },
}));

export default useThemeStore;
