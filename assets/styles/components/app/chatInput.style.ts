import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createChatInputStyle = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      //flex: 1,
      //position: 'absolute',
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      height: 50,
      maxHeight: 100,
      bottom: 0,
      gap: 10,
      marginVertical: 10,
    },

    textInputContainer: {
      width: "60%",
      height: "100%",
      overflow: "hidden",
      flexDirection: "row",
      gap: 10,
    },

    textInput: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: colors.subBackground,
      fontWeight: "500",
    },

    attachImageView: {
      height: "100%",
      aspectRatio: 1,
      borderRadius: "50%",
      overflow: "hidden",
    },

    attachButtonImage: {
      width: "100%",
      height: "100%",
    },

    centerContainer: {
      justifyContent: 'center', 
      alignItems: 'center',
    },

    sendView: {
      height: "100%",
      borderRadius: "50%",
      aspectRatio: 1,
      overflow: "hidden",
      backgroundColor: colors.background,
    },

    sendTouchOpacity: {
      flex: 1,
      backgroundColor: "#2294fb",
      color: "#000"
    },

    image: {
      width: "100%", 
      height: "100%",
    },
  });
  
  return styles
}
