import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createChatStyle = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    noMessagesText: {
      height: "80%",
      fontSize: 17,
      color: colors.lowerBackground,
      textAlign: "center",
      textAlignVertical: "center",
      fontWeight: "bold",
    },

    chatView: {
      flexDirection: "column",
      gap: 25,
      paddingTop: 10,
      paddingBottom: 10,
    },
    
    bubbleView: {
      flexDirection: "column",
      gap: 5,
    },

    globalBubble: {
      width: "45%",
      padding: 5, 
      borderRadius: 10,
    },

    senderBubble: {
      backgroundColor: "#2294fb",
      alignSelf: "flex-end",
      marginRight: 10,
    },

    reciverBubble: {
      width: "90%",
      backgroundColor: "#cfcfcf",
      marginLeft: 10,
    },

    globalBubbleInfoView: {
      width: "45%",
      height: 30,
      gap: 5,
    },

    senderBubbleInfoView: {
      alignSelf: "flex-end",
      justifyContent: "center",
    },

    reciverBubbleInfoView: {
      alignSelf: "flex-start",
      justifyContent: "center",
    },

    bubbleInfoTimeText: {
      color: colors.textColor,
    },

    bubbleInfoButton: {
      height: "100%",
      aspectRatio: 1,
      justifyContent: "center",
    },

    bubbleInfoButtonImage: {
      width: "100%",
      height: "100%",
    },

    textView: {
      flexDirection: 'column', 
      alignItems: 'flex-start',
      width: '100%',
    },

    katexView: {
      height: 50,
      width: "100%",
    },

    katex: {
      backgroundColor: "transparent",
    },

    imageView: {
      borderRadius: 10,
      overflow: "hidden",
    },

    imageBubble: {
      width: "100%", 
      aspectRatio: 1,
    },

    loadingBubbleView: {
      flexDirection: "row",
      justifyContent: "center",
      padding: 10,
      gap: 10,
    },

    reciverLoadingBubble: {
      width: "45%",
      backgroundColor: "#cfcfcf",
      marginLeft: 10,
    },

    loadingBubble: {
      flex: 1,
      width: 50,
      aspectRatio: 1,
      borderRadius: "50%",
      backgroundColor: "#888888",
      padding: 10,
    },
  });
  
  return styles
}
