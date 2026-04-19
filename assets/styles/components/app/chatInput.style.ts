import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createChatInputStyle = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      height: 50,
      maxHeight: 150,
      bottom: 0,
      gap: 10,
      marginVertical: 10,
    },

    textInputContainer: {
      width: "60%",
      overflow: "hidden",
      borderRadius: 25,
    },

    textInput: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: colors.subBackground,
      fontWeight: "500",
    },

    attachedImagesView: {
      flexDirection: "row",
      paddingBottom: 0,
      padding: 5,
      gap: 5,
      width: "100%",
      height: 50,
      backgroundColor: colors.subBackground,
    },

    attachedImageContainer: {
      height: "100%",
      aspectRatio: 1,
    },

    attachedImageView: {
      flex: 1,
      overflow: "hidden",
      borderRadius: "50%",
    },

    attachedImage: {
      flex: 1,
    },

    attachedImageDeleteButton: {
      position: "absolute",
      alignSelf: "flex-end",
      width: "50%",
      height: "50%",
      backgroundColor: "#ffffff",
    },

    attachImageView: {
      maxHeight: 50,
      height: 50,
      aspectRatio: 1,
      borderRadius: "50%",
      overflow: "hidden",
    },

    centerContainer: {
      justifyContent: 'center', 
      alignItems: 'center',
    },

    sendView: {
      maxHeight: 50,
      height: 50,
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
