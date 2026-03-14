import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createLoadingBarStyle = (colors: ColorScheme) => {
    const styles = StyleSheet.create({
        bottomCenterView: {
            justifyContent: "flex-end", 
            alignItems: "center", 
            flex: 1,
        },

        percentageView: {
            position: "absolute",
            alignSelf: "center",
            zIndex: 1,
        },

        percentageText: {
            fontSize: 30,
            textAlign: "center",
            fontWeight: "bold",
            color: colors.opposite.textColor,
            textShadowRadius: 3,
            textShadowColor: colors.opposite.textShadowColor,
        },

        infoText: {
            fontSize: 20,
            textAlign: "center",
            fontWeight: "bold",
            color: colors.textColor,
            textShadowRadius: 3,
            textShadowColor: colors.textShadowColor,
        },

        backgroundBar: {
            width: "80%",
            height: 50,
            margin: 10,
            borderWidth: 5,
            borderColor: colors.opposite.background,
            borderRadius: 25,
            justifyContent: "center",
            overflow: "hidden",
        },

        bar: {
            //width: "50%",
            height: "100%",
            borderRadius: 25,
            backgroundColor: colors.gradients.background[1],
            justifyContent: "center",
        },

        innerBar: {
            width: "98%",
            height: "90%",
            borderRadius: 25,
            alignSelf: "center",
            backgroundColor: colors.opposite.background,
        },
    });

    return styles
}
