import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createCheckboxStyle = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      width: 35,
      height: 35,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#b8b8b8",
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },

    checkedContainer: {
      backgroundColor: "#2294fb",
    },

    fit: {
      width: "100%",
      height: "100%",
    },
  });
  
  return styles
}
