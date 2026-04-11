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
    },

    textInputContainer: {
      width: "80%",
      height: "100%",
      overflow: "hidden",
    },

    textInput: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: colors.subBackground,
      fontWeight: "500",
    },
  });
  
  return styles
}
