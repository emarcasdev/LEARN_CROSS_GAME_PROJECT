import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme, ThemeName, AppTheme } from "../constants/theme";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";

type ThemeContextValue = {
  themeName: ThemeName;
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const initial: ThemeName = system === "dark" ? "dark" : "light";
  const [themeName, setTheme] = useState<ThemeName>(initial);

  const theme = themeName === "dark" ? darkTheme : lightTheme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeName,
      theme,
      setTheme,
      toggleTheme: () => setTheme((theme) => (theme === "light" ? "dark" : "light")),
    }),
    [themeName]
  );

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
}