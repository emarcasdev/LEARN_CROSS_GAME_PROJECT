export const lightTheme = {
  name: "light",
  colors: {
    bg: "#ffffff",
    text: "#111827",
    card: "#f3f4f6",
    border: "#d1d5db",
    primary: "#2596be"
  }
};

export const darkTheme = {
  name: "dark",
  colors: {
    bg: "#111827",
    text: "#f3f4f6",
    card: "#222838ff",
    border: "#3d4147ff",
    primary: "#2596be"
  }
};

export type AppTheme = typeof lightTheme | typeof darkTheme;
export type ThemeName = AppTheme["name"];