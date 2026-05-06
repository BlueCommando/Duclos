import useTheme, { ColorScheme } from '@/hooks/useTheme';
import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, TouchableOpacity } from 'react-native';

type SinglePhotoOptionProps = {
  onPress?: () => void,
  style?: StyleProp<ImageStyle>,
  source?: ImageSourcePropType,
}

const SinglePhotoOption = ({ onPress, source, style }: SinglePhotoOptionProps) => {
  const theme = useTheme();
  const stylesheet = createSinPhoOptStyle(theme);

  return (
    <TouchableOpacity style={[stylesheet.option, style]} onPress={onPress}>
      <Image source={source} style={stylesheet.image}/>
    </TouchableOpacity>
  )
};

const createSinPhoOptStyle = (color: ColorScheme) => {
  const style = StyleSheet.create({
    container: {
      flex: 1
    },

    option: {
      height: "70%",
      marginTop: 5, 
      aspectRatio: 1,
      borderRadius: "50%",
      backgroundColor: color.subBackground,
      overflow: "hidden",
    },

    image: {
      width: "100%",
      height: "100%",
    },
  })

  return style
};

export default SinglePhotoOption
