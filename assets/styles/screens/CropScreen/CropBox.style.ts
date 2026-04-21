import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const cropBoxFileStyle = {
  cornerRadius: 50,
  borderWidth: 10,
};

export const createCropBoxStyle = (colors: ColorScheme) => {
  const style = StyleSheet.create({
    cropBox: {
      position: "absolute",
      opacity: 1,
      borderWidth: 5,
      borderRadius: cropBoxFileStyle.cornerRadius / 2,
      borderColor: colors.border,
      backgroundColor: "#00000000",
    },

    globalCorner: {
      width: cropBoxFileStyle.cornerRadius,
      height: cropBoxFileStyle.cornerRadius,
      borderColor: "#ebebeb"
    },

    topLeftCornerContainer: {
      position: "absolute",
    },

    cropTopLeftCorner: {
      borderTopWidth: cropBoxFileStyle.borderWidth,
      borderLeftWidth: cropBoxFileStyle.borderWidth,
      right: cropBoxFileStyle.borderWidth / 2,
      bottom: cropBoxFileStyle.borderWidth / 2,
      borderTopLeftRadius: cropBoxFileStyle.cornerRadius / 2,
    },

    bottomLeftCornerContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
    },

    cropBottomLeftCorner: {
      borderLeftWidth: cropBoxFileStyle.borderWidth,
      borderBottomWidth: cropBoxFileStyle.borderWidth,
      top: cropBoxFileStyle.borderWidth / 2,
      right: cropBoxFileStyle.borderWidth / 2,
      borderBottomLeftRadius: cropBoxFileStyle.cornerRadius / 2,
    },

    topRightCornerContainer: {
      position: "absolute",
      top: 0,
      right: 0,
    },

    cropTopRightCorner: {
      borderTopWidth: cropBoxFileStyle.borderWidth,
      borderRightWidth: cropBoxFileStyle.borderWidth,
      left: cropBoxFileStyle.borderWidth / 2,
      bottom: cropBoxFileStyle.borderWidth / 2,
      borderTopRightRadius: cropBoxFileStyle.cornerRadius / 2,
    },

    bottomRightCornerContainer: {
      position: "absolute",
      bottom: 0,
      right: 0,
    },

    cropBottomRightCorner: {
      borderRightWidth: cropBoxFileStyle.borderWidth,
      borderBottomWidth: cropBoxFileStyle.borderWidth,
      top: cropBoxFileStyle.borderWidth / 2,
      left: cropBoxFileStyle.borderWidth / 2,
      borderBottomRightRadius: cropBoxFileStyle.cornerRadius / 2,
    },

    placeholder: {
      width: 100,
      height: 100,
      backgroundColor: "#000",
    }
  })

  return style;
};
