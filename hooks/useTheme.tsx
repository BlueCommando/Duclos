import React, { createContext, ReactNode, useContext } from 'react';
import { useColorScheme } from 'react-native';

// Detects if user is using light mode or dark mode

export interface ColorScheme {
  background: string,
  subBackground: string,
  border: string,

  textColor: string,
  textShadowColor: string,

  gradients: {
    background: [string, string],
  },

  statusBarStyle: "light-content" | "dark-content",

  opposite: ColorScheme,
}

// Opposite color is applied later.
// @ts-ignore
const lightColors: ColorScheme = {
  background: "#eeeeee",
  subBackground: "#d3d3d3",
  border: "#D7D7D7",
  
  textColor: "#050505",
  textShadowColor: "#aaaaaa",

  gradients: {
    background: ["#eeeeee", "#7e8d8f"],
  },

  statusBarStyle: "light-content" as const,
};

// Same reason as light color
// @ts-ignore
const darkColors: ColorScheme = {
  background: "#1e2433",
  subBackground: "#12161f",
  border: "#10141d",

  textColor: "#eeeeee",
  textShadowColor: "#1d1d1d",

  gradients: {
    background: ["#12161f", "#1e2433"],
  },

  statusBarStyle: "dark-content" as const,
};

lightColors.opposite = darkColors;
darkColors.opposite = lightColors;

const ThemeContext = createContext<ColorScheme | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode} ) => {
    const usersTheme = useColorScheme()
    const theme = usersTheme === "dark" ? darkColors : lightColors

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}

export default useTheme
