import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createIntroTextStyle = (colors: ColorScheme) => {
    const styles = StyleSheet.create({
        text: {
            color: colors.textColor,
            fontSize: 40,
            textAlign: 'center',
            fontFamily: 'Michroma',
        }
    });

    return styles
}
