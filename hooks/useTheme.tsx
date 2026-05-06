import React, { createContext, ReactNode, useContext } from 'react';
import { ImageSourcePropType, StatusBar, useColorScheme } from 'react-native';

// Detects if user is using light mode or dark mode

export interface ColorScheme {
  background: string,
  subBackground: string,
  lowerBackground: string,
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
    chat: ImageSourcePropType,
    imagery: ImageSourcePropType,
    settings: ImageSourcePropType,
    loadingCircle: ImageSourcePropType,
    upArrow: ImageSourcePropType,
    downArrow: ImageSourcePropType,
    rightArrow: ImageSourcePropType,
    leftArrow: ImageSourcePropType,
    check: ImageSourcePropType,
    plus: ImageSourcePropType,
    info: ImageSourcePropType,
    trash: ImageSourcePropType,
  },

  opposite: ColorScheme,
}

// Opposite color is applied later.
// @ts-ignore
export const lightColors: ColorScheme = {
  background: "#eeeeee",
  subBackground: "#d3d3d3",
  lowerBackground: "#acacac",
  border: "#D7D7D7",
  
  textColor: "#050505",
  textShadowColor: "#aaaaaa",
  textPlaceholderColor: "#2727277e",

  gradients: {
    background: ["#eeeeee", "#7e8d8f"],
  },
  
  assets: {
    chat: require("@/assets/images/DarkChat.png"),
    imagery: require("@/assets/images/DarkImage.png"),
    settings: require("@/assets/images/DarkSettings.png"),
    upArrow: require("@/assets/images/DarkUpArrow.png"),
    downArrow: require("@/assets/images/DarkDownArrow.png"),
    rightArrow: require("@/assets/images/DarkRightArrow.png"),
    leftArrow: require("@/assets/images/DarkLeftArrow.png"),
    check: require("@/assets/images/Check.png"),
    plus: require("@/assets/images/DarkPlus.png"),
    info: require("@/assets/images/DarkInfo.png"),
    loadingCircle: require("@/assets/images/DarkLoadingCircle.png"),
    trash: require("@/assets/images/Trash.png"),
  },

  statusBarStyle: "dark-content" as const,
  mode: "light" as const,
};

// Same reason as light color
// @ts-ignore
export const darkColors: ColorScheme = {
  background: "#1e2433",
  subBackground: "#12161f",
  lowerBackground: "#05060a",
  border: "#10141d",

  textColor: "#eeeeee",
  textShadowColor: "#1d1d1d",
  textPlaceholderColor: "#a8a8a880",

  gradients: {
    background: ["#12161f", "#1e2433"],
  },

  assets: {
    chat: require("@/assets/images/LightChat.png"),
    imagery: require("@/assets/images/LightImage.png"),
    settings: require("@/assets/images/LightSettings.png"),
    upArrow: require("@/assets/images/LightUpArrow.png"),
    downArrow: require("@/assets/images/LightDownArrow.png"),
    rightArrow: require("@/assets/images/LightRightArrow.png"),
    leftArrow: require("@/assets/images/LightLeftArrow.png"),
    check: require("@/assets/images/Check.png"),
    plus: require("@/assets/images/LightPlus.png"),
    info: require("@/assets/images/LightInfo.png"),
    loadingCircle: require("@/assets/images/LightLoadingCircle.png"),
    trash: require("@/assets/images/Trash.png"),
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

    StatusBar.setBarStyle(theme.statusBarStyle);

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
