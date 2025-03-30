import { create } from "zustand";

const useThemeStore = create((set) => {
  // Function to safely get theme from localStorage
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "wireframe";
    }
    return "wireframe"; // Default fallback for SSR
  };

  return {
    theme: getInitialTheme(),
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.theme === "wireframe" ? "black" : "wireframe";
        document.documentElement.setAttribute("data-theme", newTheme);
        if (typeof window !== "undefined") {
          localStorage.setItem("theme", newTheme);
        }
        return { theme: newTheme };
      });
    },
  };
});

export default useThemeStore;
