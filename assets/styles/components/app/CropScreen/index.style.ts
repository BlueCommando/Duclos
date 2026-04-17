import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createCropScreenStyle = (colors: ColorScheme) => {
  const style = StyleSheet.create({
    container: {
      flex: 1,
    },

    photo: {
      flex: 1, 
      height: null, 
      width: null, 
      resizeMode: 'contain',
    }
  });

  return style
};
