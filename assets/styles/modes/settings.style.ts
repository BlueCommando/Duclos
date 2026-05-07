import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createSettingsStyle = (colors: ColorScheme) => {
  const styleSheet = StyleSheet.create({
    container: {
      flex: 1,
    },

    background: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: colors.background,
    },

    innerScrollView: {
      flex: 1,
      alignItems: "center",
      gap: 10,
    },

    basicSettingBox: {
      width: "90%", 
      backgroundColor: colors.subBackground,
      alignContent: "center",
      alignItems: "center",
      borderRadius: 10,
      padding: 10,
      gap: 10,
      flexDirection: "row",
    },

    columnSettingBox: {
      flexDirection: "column", 
      alignItems: "flex-start",
    },

    basicInnerBox: {
      width: "90%",
      backgroundColor: colors.lowerBackground,
      alignSelf: "center",
      padding: 10,
      borderRadius: 15,
      maxHeight: 150,
    },

    inputBox: {
      width: "90%",
      backgroundColor: colors.lowerBackground,
      color: colors.textColor,
      alignSelf: "center",
      padding: 10,
      borderRadius: 15,
      maxHeight: 150,
    },

    nonEditableText: {
      color: colors.textPlaceholderColor,
    },

    smallImageView: {
      height: 35,
      width: 35,
    },

    headerText: {
      color: colors.textColor,
      fontWeight: "800",
      fontSize: 20,
    },

    text: {
      color: colors.textColor,
      fontSize: 15,
    },

    redText: {
      color: "#cf2323",
      fontWeight: "800",
      fontSize: 20,
    },

    fitImage: {
      width: "100%",
      height: "100%",
    },
  });

  return styleSheet
}
