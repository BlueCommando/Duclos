import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import useTheme, { ColorScheme } from '@/hooks/useTheme';

type PhotoOptionsProps = {
    header?: string,
    text?: string,
    onPressBack?: () => {},
    onPressForward?: () => {},
    children: React.ReactElement,
}

const PhotoOptions = ({header, text, onPressBack, onPressForward, children}: PhotoOptionsProps) => {
  const theme = useTheme();
  const style = createPhotoOptionStyle(theme);

  // buttons to go back and fourth
  return (
    <LinearGradient style={style.background} colors={theme.gradients.background}>

        <View style={style.childrenContainer}>{children}</View>

        { (header !== undefined) && <Text>{header}</Text> }
        { (text !== undefined) && <Text>{text}</Text> }

    </LinearGradient>
  )
}

const createPhotoOptionStyle = (color: ColorScheme) => {
    const style = StyleSheet.create({
        background: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },

        childrenContainer: {
            backgroundColor: color.background,
            marginBottom: 100, 
        },
    })

    return style
}

export default PhotoOptions
