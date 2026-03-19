import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createImageryStyle = (colors: ColorScheme) => {
    const styleSheet = StyleSheet.create({
        container: {
            flex: 1,
        },

        bottomCenterView: {
            justifyContent: "flex-end", 
            alignItems: "center", 
            flex: 1,
        },

        pictureBar: {
            width: "100%",
            height: 75,
            backgroundColor: colors.subBackground,
            textShadowRadius: 3,
            textShadowColor: colors.textShadowColor,
            borderTopLeftRadius: 75,
            borderTopEndRadius: 75,
            justifyContent: "center",
            alignItems: "center",
        },

        pictureButtonBorder1: {
            width: 0,
            height: "90%",
            aspectRatio: 1,
            borderRadius: "50%",
            backgroundColor: colors.opposite.background,
            justifyContent: "center",
            alignItems: "center",
        },

        pictureButtonBorder2: {
            width: 0,
            height: "90%",
            aspectRatio: 1,
            borderRadius: "50%",
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
        },

        pictureButton: {
            width: 0,
            height: "90%",
            aspectRatio: 1,
            borderRadius: "50%",
            backgroundColor: "#ff0000",
        },
    });

    return styleSheet
}
