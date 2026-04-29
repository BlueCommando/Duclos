import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createChatModeStyle = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
    },

    hideRender: {
      position: "absolute",
      opacity: 0,
    },

    chooseChatContainer: {
      width: "100%", 
      height: "100%", 
      position: "absolute",
      flexDirection: "row",
    },

    allChatsView: {
      backgroundColor: colors.background,
      height: "100%",
    },

    createChatButton: {
      height: "100%",
      aspectRatio: 1,
    },

    chatOptionsView: {
      flex: 1,
      gap: 10,
    },

    chatOption: {
      width: "100%", 
      height: 50, 
      padding: 5,
      gap: 5,
      flexDirection: "row",
      backgroundColor: colors.subBackground,
    },

    chatOptionText: {
      color: colors.textColor,
      textAlignVertical: "center",
      fontWeight: "500",
      lineHeight: 20,
      fontSize: 20,
      textShadowRadius: 3,
      textShadowColor: colors.textShadowColor,
      flexWrap: "nowrap",
      height: "100%",
    },

    showAllChatsContainer: {
      left: 10,
      width: "100%",
      height: "100%",
    },

    showAllChatsButton: {
      overflow: "hidden",
      borderRadius: "50%",
      width: 50,
      height: 50,
    },

    fitImage: {
      width: "100%",
      height: "100%",
    },
  });
  
  return styles
}
