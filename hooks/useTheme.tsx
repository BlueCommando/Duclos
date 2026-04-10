import React, { createContext, ReactNode, useContext } from 'react';
import { ImageSourcePropType, useColorScheme } from 'react-native';

// Detects if user is using light mode or dark mode

export interface ColorScheme {
  background: string,
  subBackground: string,
  border: string,

  textColor: string,
  textShadowColor: string,
  textPlaceholderColor: string,

  gradients: {
    background: [string, string],
  },

  statusBarStyle: "light-content" | "dark-content",
  mode: "light" | "dark",
  
  assets: {
    loadingCirclePath: ImageSourcePropType,
  },

  opposite: ColorScheme,
}

// Opposite color is applied later.
// @ts-ignore
export const lightColors: ColorScheme = {
  background: "#eeeeee",
  subBackground: "#d3d3d3",
  border: "#D7D7D7",
  
  textColor: "#050505",
  textShadowColor: "#aaaaaa",
  textPlaceholderColor: "#2727277e",

  gradients: {
    background: ["#eeeeee", "#7e8d8f"],
  },
  
  assets: {
    loadingCirclePath: require("@/assets/images/loading/LightLoadingCircle.png"),
  },

  statusBarStyle: "dark-content" as const,
  mode: "light" as const,
};

// Same reason as light color
// @ts-ignore
export const darkColors: ColorScheme = {
  background: "#1e2433",
  subBackground: "#12161f",
  border: "#10141d",

  textColor: "#eeeeee",
  textShadowColor: "#1d1d1d",
  textPlaceholderColor: "#a8a8a880",

  gradients: {
    background: ["#12161f", "#1e2433"],
  },

  assets: {
    loadingCirclePath: require("@/assets/images/loading/DarkLoadingCircle.png"),
  },

  statusBarStyle: "light-content" as const,
  mode: "dark" as const,
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
