import CropBox from '@/components/imagery/CropBox'
import PhotoOptions from '@/components/imagery/PhotoOptions'
import useTheme, { ColorScheme } from '@/hooks/useTheme'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Image, LayoutChangeEvent, LayoutRectangle, StyleSheet, View } from 'react-native'

const CropScreen = () => {
  const { picturePath } = useLocalSearchParams<{picturePath: string}>();

  const goBack = () => {
    if (router.canGoBack()){
      router.back()
    } else {
      router.replace("..")
    }
  };

  const goForward = () => {
    console.log("next")
  };

  const [layout, setLayout] = useState<LayoutRectangle>();
  const onLayout = (event: LayoutChangeEvent) => setLayout(event.nativeEvent.layout);

  const theme = useTheme();
  const style = createCropScreenStyle(theme);

  return (
    <PhotoOptions
      header='Crop Photo'
      text='Help the AI by cropping the taken photo to help focus on the problem.'
      onPressBack={goBack}
      onPressForward={goForward}
    >
      <View style={style.photoView} onLayout={onLayout}>
        <Image source={{uri: `file://${picturePath}`}} style={style.photo}/>
        <CropBox parentLayout={layout}/>
      </View>
      
    </PhotoOptions>
  )
};

const createCropScreenStyle = (colors: ColorScheme) => {
  const style = StyleSheet.create({
    photoView: {
      width: "100%", 
      height: 600,
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

export default CropScreen
