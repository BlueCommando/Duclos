import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createChatModeStyle = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
  
  return styles
}
