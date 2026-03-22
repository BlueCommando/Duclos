import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import useTheme, { ColorScheme } from '@/hooks/useTheme';
import SinglePhotoOption from './SinglePhotoOption';
import { SafeAreaView } from 'react-native-safe-area-context';

type PhotoOptionsProps = {
    header?: string,
    text?: string,
    onPressBack?: () => void,
    onPressForward?: () => void,
    children: React.ReactElement,
}

// Main

const PhotoOptions = ({header, text, onPressBack, onPressForward, children}: PhotoOptionsProps) => {
  const theme = useTheme();
  const style = createPhotoOptionStyle(theme);

  // buttons to go back and fourth
  return (
    <> 
        <LinearGradient style={style.background} colors={theme.gradients.background}>

            <View style={style.childrenContainer}>{children}</View>

            { (header !== undefined) && <Text>{header}</Text> }
            { (text !== undefined) && <Text>{text}</Text> }

        </LinearGradient>

        <View style={style.bottomBar}>
            <SinglePhotoOption onPress={onPressBack}/>
            <SinglePhotoOption onPress={onPressForward}/>
        </View>
    </>
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
            flex: 1,
            width: "80%",
            backgroundColor: color.opposite.background,
            marginTop: 10,
            marginBottom: 25, 
        },

        bottomBar: {
            width: "100%",
            height: 100,
            borderTopWidth: 2,
            borderColor: color.border,
            gap: "25%",
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: color.background,
        }
    })

    return style
};

export default PhotoOptions
