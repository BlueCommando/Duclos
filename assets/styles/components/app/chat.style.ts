import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createChatStyle = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    chatView: {
      flexDirection: "column",
      gap: 5,
      paddingTop: 10,
      paddingBottom: 10,
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
      backgroundColor: "#cfcfcf",
      marginLeft: 10,
    },

    textView: {
      flexDirection: 'row', 
      alignItems: 'flex-start',
      width: '100%',
    },

    textBubble: {
      flex: 1,
      padding: 10,
    },

    imageView: {
      borderRadius: 10,
      overflow: "hidden",
    },

    imageBubble: {
      width: "100%", 
      aspectRatio: 1,
    },

    loadingBubble: {
      padding: 10,
    },
  });
  
  return styles
}
