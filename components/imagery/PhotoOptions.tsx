import useTheme, { ColorScheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SinglePhotoOption from '../screens/CropScreen/SinglePhotoOption';

type PhotoOptionsProps = {
  style?: StyleProp<ViewStyle>
  header?: string,
  text?: string,
  onPressBack?: () => void,
  onPressForward?: () => void,
  children?: React.ReactNode,
}

const PhotoOptions = ({style, header, text, onPressBack, onPressForward, children}: PhotoOptionsProps) => {
  const theme = useTheme();
  const stylesheet = createPhotoOptionStyle(theme);

  return (
  <> 
    <LinearGradient colors={theme.gradients.background}/>

    <SafeAreaView style={stylesheet.mainContainer}>
      <View style={[stylesheet.childrenContainer, style]}>{children}</View>

      { (header !== undefined) && <Text style={stylesheet.headerText}>{header}</Text> }
      { (text !== undefined) && <Text style={stylesheet.text}>{text}</Text> }
    </SafeAreaView>

    <View style={stylesheet.bottomBar}>
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
      height: 600,
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
    },

    headerText: {
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 25,
      marginBottom: 10,
    },

    text: {
      textAlign: "center",
      fontSize: 15,
    }
  })

  return style
};

export default PhotoOptions
