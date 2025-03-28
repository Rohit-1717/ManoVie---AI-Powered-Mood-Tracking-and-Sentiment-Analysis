import useThemeStore from "../store/useThemeStore";


const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();
  return { theme, toggleTheme };
};

export default useTheme;
