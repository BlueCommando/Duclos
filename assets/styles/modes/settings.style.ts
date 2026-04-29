import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createSettingsStyle = (colors: ColorScheme) => {
  const styleSheet = StyleSheet.create({
    container: {
      flex: 1,
    },

    innerScrollView: {
      flex: 1,
      alignItems: "center",
    },

    basicSettingBox: {
      width: "90%", 
      backgroundColor: colors.subBackground,
      alignContent: "center",
      borderRadius: 10,
      padding: 10,
    }
  });

  return styleSheet
}
