import useTheme, { ColorScheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SinglePhotoOption from './SinglePhotoOption';

type PhotoOptionsProps = {
    header?: string,
    text?: string,
    onPressBack?: () => void,
    onPressForward?: () => void,
    children: React.ReactNode,
}

const PhotoOptions = ({header, text, onPressBack, onPressForward, children}: PhotoOptionsProps) => {
  const theme = useTheme();
  const style = createPhotoOptionStyle(theme);

  return (
    <> 
        <LinearGradient colors={theme.gradients.background}/>

        <SafeAreaView style={style.mainContainer}>
            <View style={style.childrenContainer}>{children}</View>

            { (header !== undefined) && <Text>{header}</Text> }
            { (text !== undefined) && <Text>{text}</Text> }
        </SafeAreaView>

        <View style={style.bottomBar}>
            <SinglePhotoOption onPress={onPressBack}/>
            <SinglePhotoOption onPress={onPressForward}/>
        </View>
    </>
  )
}

const createPhotoOptionStyle = (color: ColorScheme) => {
    const style = StyleSheet.create({
        mainContainer: {
            flex: 1,
            alignItems: "center",
        },

        childrenContainer: {
            width: "100%",
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
