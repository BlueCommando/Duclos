import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createPromptScreenStyle = (colors: ColorScheme) => {
  const stylesheet = StyleSheet.create({
    container: {
      flex: 1
    },

    textInput: {
      flex: 1,
      flexDirection: "row",
      fontSize: 20,
      color: colors.opposite.textColor,
      margin: 10,
    },
  });

  return stylesheet
};
