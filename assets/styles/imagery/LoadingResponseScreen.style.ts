import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createLoadingResponseScreenStyle = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    centerView: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      flexDirection: "row",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    infoContainer: {
      width: "50%",
      bottom: "10%",
      aspectRatio: 0.75,
    },

    edgeContainer: {
      flex: 1,
      margin: 5,
    },

    headerText: {
      color: colors.textColor,
      fontSize: 17,
      fontWeight: "bold",
    },

    text: {
      color: colors.opposite.textColor,
      margin: 5,
    },

    scrollView: {
      backgroundColor: colors.opposite.subBackground,
    },

    fitImage: {
      flex: 1, 
      height: null, 
      width: null, 
      resizeMode: 'contain',
    },

    photo: {
      backgroundColor: colors.opposite.subBackground,
    },

    loadingScreenView: {
      width: "40%",
      top: "20%",
      aspectRatio: 1,
    },

    loadingText: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
      flexWrap: "wrap",
      flexShrink: 0,
      marginTop: 10,
    },
  });
  
  return styles
}
